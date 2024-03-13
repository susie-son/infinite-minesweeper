import { useEffect, useState } from 'react'
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
  &:hover {
    background: ${(props) => props.$hoverBackground};
    cursor: ${(props) => props.$hoverCursor};
  }
  transition: transform 0.2s;
  &:active {
    transform: scale(0.95);
  }
`

export enum TileType {
  Reveal,
  Hidden,
  Flag,
  None
}

interface TileComponentProps {
  tile: Tile | undefined
  neighbourTypes: boolean[]
}

const TileComponent = ({ tile, neighbourTypes }: TileComponentProps) => {
  const [tileState, setTileState] = useState(TileType.None)

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

  const getBorder = (): string => {
    switch (tileState) {
      case TileType.Reveal:
        return `1px groove ${borderColour}`
      default:
        return '1px solid transparent'
    }
  }

  const getBackground = (): string => {
    switch (tileState) {
      case TileType.Reveal:
        return revealBackgroundColour
      case TileType.Flag:
      case TileType.Hidden:
        return hiddenBackgroundColour
      default:
        return 'transparent'
    }
  }

  const getHoverBackground = (): string => {
    switch (tileState) {
      case TileType.Reveal:
        return revealBackgroundColour
      case TileType.Flag:
      case TileType.Hidden:
        return hoverBackgroundColour
      default:
        return 'transparent'
    }
  }

  const getHoverCursor = (): string => {
    switch (tileState) {
      case TileType.Flag:
      case TileType.Hidden:
        return 'pointer'
      default:
        return 'auto'
    }
  }

  const getBorderRadius = (neighbourTypes: boolean[]): string => {
    let borderRadius = '20px'
    let topLeft = [0, 1, 3].every((i) => neighbourTypes[i]) ? borderRadius : '0px'
    let topRight = [1, 2, 4].every((i) => neighbourTypes[i]) ? borderRadius : '0px'
    let bottomRight = [4, 6, 7].every((i) => neighbourTypes[i]) ? borderRadius : '0px'
    let bottomLeft = [3, 5, 6].every((i) => neighbourTypes[i]) ? borderRadius : '0px'

    return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`
  }

  const getTextColour = () => {
    switch (tile?.adjacentMines) {
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

  useEffect(() => {
    if (tile) {
      setTileState(tile.isFlagged ? TileType.Flag : tile.isRevealed ? TileType.Reveal : TileType.Hidden)
    } else {
      setTileState(TileType.None)
    }
  }, [tile, tile?.isRevealed, tile?.isFlagged])

  return (
    <TileWrapper $border={getBorder()}>
      <TileContent
        $textColour={getTextColour()}
        $background={getBackground()}
        $hoverBackground={getHoverBackground()}
        $borderRadius={getBorderRadius(neighbourTypes)}
        $hoverCursor={getHoverCursor()}
      >
        {getTileSymbol()}
      </TileContent>
    </TileWrapper>
  )
}

export default TileComponent
