import { Tile } from './Tile'
import { Position } from './Position'

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

  addTile(position: Position, tile: Tile): void {
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

  invalidateCache(): void {
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
