import { memo } from 'react'
import styled from 'styled-components'
import {
  borderColour,
  hiddenBackgroundColour,
  hoverBackgroundColour,
  mineColour1,
  mineColour2,
  mineColour3,
  mineColour4,
  mineColour5,
  mineColour6,
  mineColour7,
  mineColour8,
  revealBackgroundColour
} from './constants'

export class Tile {
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number

  constructor(adjacentMines = 0) {
    this.isRevealed = false
    this.isFlagged = false
    this.adjacentMines = adjacentMines
  }

  isMine(): boolean {
    return this.adjacentMines === 9
  }

  isEmpty(): boolean {
    return this.adjacentMines === 0
  }

  clone(): Tile {
    const newTile = new Tile()
    newTile.isRevealed = this.isRevealed
    newTile.isFlagged = this.isFlagged
    newTile.adjacentMines = this.adjacentMines
    return newTile
  }
}

interface TileWrapperProps {
  $border: string
}

const TileWrapper = styled.div<TileWrapperProps>`
  width: 50px;
  height: 50px;
  padding: 0px;
  border: ${(props) => props.$border};
`

interface TileContentProps {
  $textColour: string
  $background: string
  $hoverBackground: string
  $borderRadius: string
  $hoverCursor: string
  $animation: string
}

const TileContent = styled.div<TileContentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: ${(props) => props.$background};
  color: ${(props) => props.$textColour};
  border-radius: ${(props) => props.$borderRadius};
  font-family: 'Madimi One', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20pt;
  transition:
    background-color 0.3s ease,
    transform 0.5s;
  &:hover {
    background: ${(props) => props.$hoverBackground};
    cursor: ${(props) => props.$hoverCursor};
  }
  &:active {
    transform: scale(0.95);
  }
  animation: ${(props) => props.$animation};
  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`

interface TileComponentProps {
  tile: Tile | undefined
  neighbourTypes: boolean[]
}

const TileComponent = ({ tile, neighbourTypes }: TileComponentProps) => {
  const border = tile && tile.isRevealed ? `1px groove ${borderColour}` : '1px solid transparent'
  const background = tile ? (tile.isRevealed ? revealBackgroundColour : hiddenBackgroundColour) : 'transparent'
  const hoverBackground = tile ? (tile.isRevealed ? revealBackgroundColour : hoverBackgroundColour) : 'transparent'
  const hoverCursor = tile && (tile.isFlagged || tile.isRevealed) ? 'pointer' : 'auto'
  const animation = tile && tile.isFlagged ? 'bounce 0.5s ease' : 'none'

  const getTileSymbol = () => {
    if (tile) {
      if (tile.isFlagged) return '🚩'
      if (tile.isRevealed) {
        if (tile.isMine()) return '💔'
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
        return mineColour1
      case 2:
        return mineColour2
      case 3:
        return mineColour3
      case 4:
        return mineColour4
      case 5:
        return mineColour5
      case 6:
        return mineColour6
      case 7:
        return mineColour7
      case 8:
        return mineColour8
      default:
        return 'black'
    }
  }

  return (
    <TileWrapper $border={border}>
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
