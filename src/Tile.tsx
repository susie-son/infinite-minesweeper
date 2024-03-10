import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

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
  user-select: none;
  padding: 0px;
  border: ${(props) => props.$border};
`

interface TileContentProps {
  $background: string
  $borderRadius: string
}

const TileContent = styled.div<TileContentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: ${(props) => props.$background};
  color: #f395a5;
  border-radius: ${(props) => props.$borderRadius};
  font-family: 'Madimi One', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20pt;
`

enum TileState {
  Reveal,
  Hidden,
  Flag,
  None
}

interface TileComponentProps {
  tile: Tile | undefined
}

const TileComponent = ({ tile }: TileComponentProps) => {
  const [tileState, setTileState] = useState(TileState.None)

  const getTileSymbol = () => {
    if (tile) {
      if (tile.isFlagged) return '🚩'
      if (tile.isRevealed) {
        if (tile.isMine()) return '💣'
        if (!tile.isEmpty()) return tile.adjacentMines
      }
    }
    return ''
  }

  const getBorder = (): string => {
    switch (tileState) {
      case TileState.None:
      case TileState.Hidden:
        return '1px solid transparent'
      default:
        return '1px groove #ebd6b7'
    }
  }

  const getBackground = (): string => {
    switch (tileState) {
      case TileState.Flag:
        return '#31ffe0'
      case TileState.Reveal:
        return '#fff6bd'
      case TileState.Hidden:
        return '#31ffe0'
      default:
        return 'transparent'
    }
  }

  const getBorderRadius = (): string => {
    switch (tileState) {
      case TileState.Hidden:
      case TileState.Flag:
        return '10px'
      default:
        return '0px'
    }
  }

  useEffect(() => {
    if (tile) {
      setTileState(tile.isFlagged ? TileState.Flag : tile.isRevealed ? TileState.Reveal : TileState.Hidden)
    } else {
      setTileState(TileState.None)
    }
  }, [tile, tile?.isRevealed, tile?.isFlagged])

  return (
    <TileWrapper $border={getBorder()}>
      <TileContent $background={getBackground()} $borderRadius={getBorderRadius()}>
        {getTileSymbol()}
      </TileContent>
    </TileWrapper>
  )
}

export default TileComponent
