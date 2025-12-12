import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import Fuse from 'fuse.js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q, limit = '10' } = req.query

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' })
  }

  try {
    const query = q.trim()
    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50)

    // Fetch a reasonable slice of active products to search in memory
    // (This avoids complex DB operators and works for small/medium catalogs)
    const { data: products, error } = await supabase
      .from('products')
      .select(
        `id, sku, name, brand, description, price, is_new, is_active, images:product_images(image_url, is_primary), promotion:promotions(discount_percent, is_active)`
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(2000)

    if (error) {
      console.error('Supabase fetch error:', error)
      throw error
    }

    const list = (products || []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      brand: p.brand || '',
      description: p.description || '',
      price: p.price,
      is_new: p.is_new,
      images: p.images || [],
      promotion: p.promotion || [],
    }))

    // If the query is a clear brand or sku substring match, prefer those
    const qLower = query.toLowerCase()
    const directMatches = list.filter((p) => (
      (p.brand && p.brand.toLowerCase().includes(qLower)) ||
      (p.sku && p.sku.toLowerCase().includes(qLower)) ||
      (p.name && p.name.toLowerCase().includes(qLower))
    ))

    let finalMatches: any[] = []
    if (directMatches.length > 0) {
      finalMatches = directMatches.slice(0, limitNum)
    } else {
      const fuse = new Fuse(list, {
        keys: [
          { name: 'brand', weight: 0.9 },
          { name: 'name', weight: 0.7 },
          { name: 'sku', weight: 0.5 },
          { name: 'description', weight: 0.3 },
        ],
        threshold: 0.4,
        distance: 100,
        ignoreLocation: true,
        minMatchCharLength: 2,
      })

      finalMatches = fuse.search(query, { limit: limitNum }).map(r => r.item)
    }

    const results = finalMatches.map((product: any) => {
      const activePromotion = product.promotion?.find((p: any) => p.is_active)
      const discountPercent = activePromotion?.discount_percent || 0
      const finalPrice = discountPercent > 0 
        ? product.price * (1 - discountPercent / 100) 
        : product.price

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        discount_percent: discountPercent,
        final_price: Math.round(finalPrice * 100) / 100,
        image: product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url,
      }
    })

    // Also search categories (simple ilike) to return matching categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug, name')
      .eq('is_active', true)
      .ilike('name', `%${query}%`)
      .limit(5)

    return res.status(200).json({
      products: results,
      categories: categories || [],
      query: query,
    })

  } catch (error) {
    console.error('Search API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
