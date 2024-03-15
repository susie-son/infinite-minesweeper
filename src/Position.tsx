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
