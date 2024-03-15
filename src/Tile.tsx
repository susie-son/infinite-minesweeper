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
