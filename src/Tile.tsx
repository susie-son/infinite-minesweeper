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
        if (tile.isMine()) return '💣'
        if (!tile.isEmpty()) return tile.adjacentMines
      }
    }
    return ''
  }

  const getBorder = (): string => {
    switch (tileState) {
      case TileType.Reveal:
        return '1px groove #ebd6b7'
      default:
        return '1px solid transparent'
    }
  }

  const getBackground = (): string => {
    switch (tileState) {
      case TileType.Flag:
        return '#31ffe0'
      case TileType.Reveal:
        return '#fff6bd'
      case TileType.Hidden:
        return '#31ffe0'
      default:
        return 'transparent'
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

  useEffect(() => {
    if (tile) {
      setTileState(tile.isFlagged ? TileType.Flag : tile.isRevealed ? TileType.Reveal : TileType.Hidden)
    } else {
      setTileState(TileType.None)
    }
  }, [tile, tile?.isRevealed, tile?.isFlagged])

  return (
    <TileWrapper $border={getBorder()}>
      <TileContent $background={getBackground()} $borderRadius={getBorderRadius(neighbourTypes)}>
        {getTileSymbol()}
      </TileContent>
    </TileWrapper>
  )
}

export default TileComponent
