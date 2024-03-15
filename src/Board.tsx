import React, { useMemo } from 'react'
import styled from 'styled-components'
import TileComponent, { Tile } from './Tile'

export class Position {
  row: number
  col: number

  constructor(row: number, col: number) {
    this.row = row
    this.col = col
  }

  static getPosition(key: string): Position {
    const split = key.split('_')
    const row = parseInt(split[0])
    const col = parseInt(split[1])
    return new Position(row, col)
  }

  getKey(): string {
    return `${this.row}_${this.col}`
  }
}

export class Board {
  minRow: number
  maxRow: number
  minCol: number
  maxCol: number
  map: Map<string, Tile>

  private gridCache: (Tile | undefined)[][] | null = null
  private neighbourCache = new Map<string, boolean[]>()

  // Create starting tile at the origin
  constructor() {
    this.minRow = 0
    this.maxRow = 0
    this.minCol = 0
    this.maxCol = 0

    this.map = new Map()
    this.addTile(new Position(0, 0), new Tile())
  }

  addTile(position: Position, tile: Tile) {
    this.minRow = Math.min(this.minRow, position.row)
    this.maxRow = Math.max(this.maxRow, position.row)
    this.minCol = Math.min(this.minCol, position.col)
    this.maxCol = Math.max(this.maxCol, position.col)
    this.map.set(position.getKey(), tile)
  }

  getTile(position: Position): Tile | undefined {
    return this.map.get(position.getKey())
  }

  hasTile(position: Position): boolean {
    return this.map.has(position.getKey())
  }

  generateGrid(): (Tile | undefined)[][] {
    if (this.gridCache) {
      return this.gridCache
    }

    let grid = Array<Array<Tile | undefined>>()

    for (let r = this.minRow; r <= this.maxRow; r++) {
      let rowArray = Array<Tile | undefined>()
      for (let c = this.minCol; c <= this.maxCol; c++) {
        const position = new Position(r, c)
        const tile = this.getTile(position)
        rowArray.push(tile)
      }
      grid.push(rowArray)
    }

    return grid
  }

  invalidateCache() {
    this.gridCache = null
    this.neighbourCache.clear()
  }

  getNeighbourTypes(row: number, col: number): boolean[] {
    const position = new Position(row, col)
    const key = position.getKey()

    if (this.neighbourCache.has(key)) {
      return this.neighbourCache.get(key)!
    }

    let neighbours: boolean[] = []
    const offsets = [-1, 0, 1]

    offsets.forEach((rowOffset) => {
      offsets.forEach((colOffset) => {
        if (rowOffset !== 0 || colOffset !== 0) {
          const neighbourPosition = new Position(row + rowOffset, col + colOffset)
          const tile = this.getTile(neighbourPosition)
          neighbours.push(!tile)
        }
      })
    })

    return neighbours
  }

  getScore(): number {
    let score = 0
    for (let r = this.minRow; r <= this.maxRow; r++) {
      for (let c = this.minCol; c <= this.maxCol; c++) {
        const position = new Position(r, c)
        const tile = this.getTile(position)
        if (tile && tile.isRevealed && !tile.isMine()) {
          score += tile.adjacentMines
        }
      }
    }
    return score
  }

  clone(): Board {
    const newBoard = new Board()
    this.map.forEach((value, key) => {
      const tile = value.clone()
      newBoard.addTile(Position.getPosition(key), tile)
    })
    return newBoard
  }
}

const BoardWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1;
`

const RowWrapper = styled.div`
  display: flex;
`

interface TileWrapperProps {
  $delay: number
}

const TileWrapper = styled.div.attrs<TileWrapperProps>((props) => ({
  style: {
    animation: `fadeIn 0.5s ease-out ${props.$delay}ms backwards`
  }
}))`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

interface BoardComponentProps {
  board: Board
  handleTileMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => void
  handleTileMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => void
}

const BoardComponent = ({ board, handleTileMouseDown, handleTileMouseUp }: BoardComponentProps) => {
  const grid = useMemo(() => board.generateGrid(), [board])

  return (
    <BoardWrapper>
      {grid.map((row, rowIndex: number) => {
        const adjustedRowIndex = rowIndex + board.minRow
        return (
          <RowWrapper key={adjustedRowIndex}>
            {row.map((tile, colIndex) => {
              const adjustedColIndex = colIndex + board.minCol
              const delay = (rowIndex * grid.length + colIndex) * 2
              return (
                <TileWrapper
                  key={adjustedColIndex}
                  onMouseDown={(e) => handleTileMouseDown(e, adjustedRowIndex, adjustedColIndex)}
                  onMouseUp={(e) => handleTileMouseUp(e, adjustedRowIndex, adjustedColIndex)}
                  onContextMenu={(e) => e.preventDefault()}
                  $delay={delay}
                >
                  <TileComponent
                    tile={tile}
                    neighbourTypes={board.getNeighbourTypes(adjustedRowIndex, adjustedColIndex)}
                  />
                </TileWrapper>
              )
            })}
          </RowWrapper>
        )
      })}
    </BoardWrapper>
  )
}

export default BoardComponent
