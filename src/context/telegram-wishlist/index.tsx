import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useTelegramAuth } from '@/context/telegram-auth'

export interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    price: number
    sku: string
    is_new: boolean
    images: Array<{ url: string; position: number }>
  }
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  isInWishlist: (productId: string) => boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  toggleWishlist: (productId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

interface WishlistProviderProps {
  children: ReactNode
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { user, telegramUser } = useTelegramAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const userId = user?.id || null
  const telegramId = telegramUser?.id || null

  // Fetch wishlist items
  const refreshWishlist = useCallback(async () => {
    const LOCAL_KEY = 'local_wishlist_v1'

    // If not authenticated, load from localStorage fallback
    if (!userId && !telegramId) {
      try {
        if (typeof window === 'undefined') {
          setItems([])
          setIsLoading(false)
          return
        }

        const localIds: string[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
        if (!localIds || localIds.length === 0) {
          setItems([])
          setIsLoading(false)
          return
        }

        // Try to fetch product details for these ids; if supabase not available, create minimal items
        if (supabase) {
          const { data: products, error } = await supabase
            .from('products')
            .select(`
              id,
              name,
              price,
              sku,
              is_new,
              images:product_images(url, position)
            `)
            .in('id', localIds)

          if (error) {
            // fallback to minimal
            const fallback = localIds.map(id => ({ product_id: id, id, product: { id, name: '', price: 0, sku: id, is_new: false, images: [] } }))
            setItems(fallback as any)
          } else {
            const wishlistItems = (products || []).map((p: any) => ({
              id: `local-${p.id}`,
              product_id: p.id,
              product: {
                id: p.id,
                name: p.name,
                price: p.price,
                sku: p.sku || p.id,
                is_new: p.is_new,
                images: p.images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => ({ url: img.url, position: img.position })) || [],
              }
            }))
            setItems(wishlistItems)
          }
        } else {
          const fallback = localIds.map(id => ({ product_id: id, id, product: { id, name: '', price: 0, sku: id, is_new: false, images: [] } }))
          setItems(fallback as any)
        }
      } catch (error) {
        console.error('Error loading local wishlist:', error)
        setItems([])
      } finally {
        setIsLoading(false)
      }

      return
    }

    setIsLoading(true)
    try {
      // Get actual user_id from telegram_users if needed
      let actualUserId = userId
      
      if (!actualUserId && telegramId) {
        const { data: telegramUserData } = await supabase
          .from('telegram_users')
          .select('id')
          .eq('telegram_id', telegramId.toString())
          .single()
        
        actualUserId = telegramUserData?.id
      }

      if (!actualUserId) {
        setItems([])
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          product:products(
            id,
            name,
            price,
            sku,
            is_new,
            images:product_images(url, position)
          )
        `)
        .eq('user_id', actualUserId)

      if (error) {
        console.error('Error fetching wishlist:', error)
        setItems([])
      } else {
        const wishlistItems = (data || []).map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            images: item.product?.images?.sort((a: any, b: any) => a.position - b.position) || []
          }
        }))
        setItems(wishlistItems)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [userId, telegramId])

  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId)
  }, [items])

  // Add to wishlist
  const addToWishlist = useCallback(async (productId: string) => {
    const LOCAL_KEY = 'local_wishlist_v1'

    if (isInWishlist(productId)) return

    // If unauthenticated, persist locally
    if (!userId && !telegramId) {
      try {
        if (typeof window !== 'undefined') {
          const localIds: string[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
          if (!localIds.includes(productId)) {
            localIds.push(productId)
            localStorage.setItem(LOCAL_KEY, JSON.stringify(localIds))
          }
        }

        // Optionally fetch product to show in list
        if (supabase) {
          const { data } = await supabase
            .from('products')
            .select(`id, name, price, sku, is_new, images:product_images(url, position)`)
            .eq('id', productId)
            .single()

          if (data) {
            setItems(prev => [
              ...prev,
              {
                id: `local-${data.id}`,
                product_id: data.id,
                product: {
                  id: data.id,
                  name: data.name,
                  price: data.price,
                  sku: data.sku || data.id,
                  is_new: data.is_new,
                  images: data.images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => ({ url: img.url, position: img.position })) || [],
                }
              }
            ])
          } else {
            setItems(prev => [...prev, { id: `local-${productId}`, product_id: productId, product: { id: productId, name: '', price: 0, sku: productId, is_new: false, images: [] } } as any])
          }
        } else {
          setItems(prev => [...prev, { id: `local-${productId}`, product_id: productId, product: { id: productId, name: '', price: 0, sku: productId, is_new: false, images: [] } } as any])
        }
      } catch (error) {
        console.error('Error adding to local wishlist:', error)
      }

      return
    }

    // Authenticated path: insert into DB
    try {
      // Get or create user_id from telegram_users table
      let actualUserId = userId
      
      if (!actualUserId && telegramId) {
        // Try to find existing user
        const { data: existingUser } = await supabase
          .from('telegram_users')
          .select('id')
          .eq('telegram_id', telegramId.toString())
          .single()
        
        if (existingUser) {
          actualUserId = existingUser.id
        } else {
          // Create new user
          const { data: newUser, error: userError } = await supabase
            .from('telegram_users')
            .insert({
              telegram_id: telegramId.toString(),
              first_name: 'User',
            })
            .select('id')
            .single()
          
          if (userError || !newUser) {
            console.error('Error creating user:', userError)
            return
          }
          actualUserId = newUser.id
        }
      }

      if (!actualUserId) {
        console.error('Could not determine user ID')
        return
      }

      const { error } = await supabase
        .from('wishlist')
        .insert({
          product_id: productId,
          user_id: actualUserId,
        })

      if (error) {
        console.error('Error adding to wishlist:', error)
        return
      }

      await refreshWishlist()
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }, [userId, telegramId, isInWishlist, refreshWishlist])

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    const LOCAL_KEY = 'local_wishlist_v1'

    // If unauthenticated, remove from localStorage
    if (!userId && !telegramId) {
      try {
        if (typeof window !== 'undefined') {
          const localIds: string[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
          const filtered = localIds.filter(id => id !== productId)
          localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered))
        }
        setItems(prev => prev.filter(item => item.product_id !== productId))
      } catch (error) {
        console.error('Error removing from local wishlist:', error)
      }

      return
    }

    try {
      // Get actual user_id from telegram_users if needed
      let actualUserId = userId
      
      if (!actualUserId && telegramId) {
        const { data: telegramUserData } = await supabase
          .from('telegram_users')
          .select('id')
          .eq('telegram_id', telegramId.toString())
          .single()
        
        actualUserId = telegramUserData?.id
      }

      if (!actualUserId) return

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', actualUserId)

      if (error) {
        console.error('Error removing from wishlist:', error)
        return
      }

      setItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }, [userId, telegramId])

  // Toggle wishlist
  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      refreshWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistProvider
