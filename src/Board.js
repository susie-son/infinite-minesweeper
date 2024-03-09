import Tile, { TileInfo } from "./Tile";
import styled from "styled-components";

export class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  getKey() {
    return `${this.row}_${this.col}`;
  }
}

export class BoardInfo {
  // Create starting tile at the origin
  constructor() {
    this.minRow = 0;
    this.maxRow = 0;
    this.minCol = 0;
    this.maxCol = 0;

    this.map = new Map();
    this.addTile(new Position(0, 0), new TileInfo(0));
  }

  addTile(position, tile) {
    this.minRow = Math.min(this.minRow, position.row);
    this.maxRow = Math.max(this.maxRow, position.row);
    this.minCol = Math.min(this.minCol, position.col);
    this.maxCol = Math.max(this.maxCol, position.col);
    this.map.set(position.getKey(), tile);
  }

  getTile(position) {
    return this.map.get(position.getKey());
  }

  hasTile(position) {
    return this.map.has(position.getKey());
  }

  generateGrid() {
    let grid = [];

    for (let r = this.minRow; r <= this.maxRow; r++) {
      let rowArray = [];
      for (let c = this.minCol; c <= this.maxCol; c++) {
        const position = new Position(r, c);
        const tile = this.getTile(position);
        rowArray.push(tile ? tile : null);
      }
      grid.push(rowArray);
    }

    return grid;
  }
}

const StyledRow = styled.div`
  display: flex;
  flexdirection: row;
`;

const Board = ({ board, handleTileMouseDown, handleTileMouseUp }) => {
  const grid = board.generateGrid();

  return (
    <div>
      {grid.map((row, rowIndex) => {
        const adjustedRowIndex = rowIndex + board.minRow;
        return (
          <StyledRow key={adjustedRowIndex}>
            {row.map((tile, colIndex) => {
              const adjustedColIndex = colIndex + board.minCol;
              return (
                <div
                  key={adjustedColIndex}
                  onMouseDown={(e) =>
                    handleTileMouseDown(e, adjustedRowIndex, adjustedColIndex)
                  }
                  onMouseUp={(e) =>
                    handleTileMouseUp(e, adjustedRowIndex, adjustedColIndex)
                  }
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <Tile tile={tile} />
                </div>
              );
            })}
          </StyledRow>
        );
      })}
    </div>
  );
};

export default Board;
