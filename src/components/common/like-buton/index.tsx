import { LikeButtonProps } from './types'
import * as Styles from './styles'
import { Icon } from '../icon'

export function LikeButton(props: LikeButtonProps) {
  const { active, onLike } = props

  const handleClick = () => {
    if (typeof onLike === 'function') {
      onLike()
    }
  }

  return (
    <Styles.Button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
    >
      <Icon
        name={active ? 'heart' : 'heartOutline'}
        color={active ? 'error' : 'ancesst0'}
      />
    </Styles.Button>
  )
}

export default LikeButton
