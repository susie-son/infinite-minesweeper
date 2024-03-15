import { memo } from 'react'
import {
  COLOUR_BORDER,
  COLOUR_BACKGROUND_HIDDEN,
  COLOUR_BACKGROUND_HOVER,
  COLOUR_MINE_1,
  COLOUR_MINE_2,
  COLOUR_MINE_3,
  COLOUR_MINE_4,
  COLOUR_MINE_5,
  COLOUR_MINE_6,
  COLOUR_MINE_7,
  COLOUR_MINE_8,
  COLOUR_BACKGROUND_REVEAL,
  SYMBOL_FLAG,
  SYMBOL_MINE
} from '../../constants'
import { Tile } from '../../Tile'
import { TileWrapper } from './TileWrapper'
import { TileContent } from './TileContent'

interface TileComponentProps {
  tile: Tile | undefined
  neighbourTypes: boolean[]
  $animationDelay: number
  handleTileMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => void
  handleTileMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => void
  adjustedRowIndex: number
  adjustedColIndex: number
}

const TileComponent = ({
  tile,
  neighbourTypes,
  $animationDelay: $delay,
  handleTileMouseDown,
  handleTileMouseUp,
  adjustedRowIndex,
  adjustedColIndex
}: TileComponentProps) => {
  const border = tile && tile.isRevealed ? `1px groove ${COLOUR_BORDER}` : '1px solid transparent'
  const background = tile ? (tile.isRevealed ? COLOUR_BACKGROUND_REVEAL : COLOUR_BACKGROUND_HIDDEN) : 'transparent'
  const hoverBackground = tile ? (tile.isRevealed ? COLOUR_BACKGROUND_REVEAL : COLOUR_BACKGROUND_HOVER) : 'transparent'
  const hoverCursor = tile && (tile.isFlagged || !tile.isRevealed) ? 'pointer' : 'auto'
  const animation = tile && tile.isFlagged ? 'bounce 0.5s ease' : 'none'

  const getTileSymbol = () => {
    if (tile) {
      if (tile.isFlagged) return SYMBOL_FLAG
      if (tile.isRevealed) {
        if (tile.isMine()) return SYMBOL_MINE
        if (!tile.isEmpty()) return tile.adjacentMines
      }
    }
    return ''
  }

  const getBorderRadius = (neighbourTypes: boolean[]): string => {
    let borderRadius = '20px'
    let topLeft = [0, 1, 3].every((i) => neighbourTypes[i]) ? borderRadius : '0px'
    let topRight = [1, 2, 4].every((i) => neighbourTypes[i]) ? borderRadius : '0px'
    let bottomRight = [4, 6, 7].every((i) => neighbourTypes[i]) ? borderRadius : '0px'
    let bottomLeft = [3, 5, 6].every((i) => neighbourTypes[i]) ? borderRadius : '0px'

    return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`
  }

  const getTextColour = (adjacentMines: number) => {
    switch (adjacentMines) {
      case 1:
        return COLOUR_MINE_1
      case 2:
        return COLOUR_MINE_2
      case 3:
        return COLOUR_MINE_3
      case 4:
        return COLOUR_MINE_4
      case 5:
        return COLOUR_MINE_5
      case 6:
        return COLOUR_MINE_6
      case 7:
        return COLOUR_MINE_7
      case 8:
        return COLOUR_MINE_8
      default:
        return 'black'
    }
  }

  return (
    <TileWrapper
      $border={border}
      $animationDelay={$delay}
      onMouseDown={(e) => handleTileMouseDown(e, adjustedRowIndex, adjustedColIndex)}
      onMouseUp={(e) => handleTileMouseUp(e, adjustedRowIndex, adjustedColIndex)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <TileContent
        $textColour={getTextColour(tile ? tile.adjacentMines : 0)}
        $background={background}
        $hoverBackground={hoverBackground}
        $borderRadius={getBorderRadius(neighbourTypes)}
        $hoverCursor={hoverCursor}
        $animation={animation}
      >
        {getTileSymbol()}
      </TileContent>
    </TileWrapper>
  )
}

export default memo(TileComponent)
