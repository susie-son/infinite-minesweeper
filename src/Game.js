import { useState } from "react";
import Board, { BoardInfo, Position } from "./Board";
import { TileInfo } from "./Tile";

const Game = () => {
  const [board, setBoard] = useState(new BoardInfo());
  const [mouseButtons, setMouseButtons] = useState(0);

  // Returns whether a mine should be generated based on position
  const generateMine = (position) => {
    const { row, col } = position;
    // Avoid placing mines too close to the origin
    if (row ** 2 + col ** 2 <= 2) return false;
    return Math.random() < 0.2;
  };

  const handleTileMouseDown = (e, row, col) => {
    if (e.buttons === 2) {
      toggleFlag(row, col);
    }
    setMouseButtons(e.buttons);
  };

  const handleTileMouseUp = (e, row, col) => {
    if (mouseButtons === 1 && e.buttons === 0) {
      revealTile(row, col);
    } else if (mouseButtons === 3) {
      handleChord(row, col);
    }
    setMouseButtons(0);
  };

  const expandBoard = (board, row, col) => {
    let newBoard = Object.assign(board);
    let toExpand = [];

    // Iterate through neighbouring tiles
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        const newPosition = new Position(newRow, newCol);

        // If no tile exists at this position, mark it for expansion
        if (!newBoard.hasTile(newPosition)) {
          toExpand.push(newPosition);
        }
      }
    }

    // Add new tiles or update existing ones based on mine generation logic
    toExpand.forEach((position) => {
      // Use 9 to indicate a mine, otherwise use 0 to indicate an initially empty tile
      const newTile = new TileInfo(generateMine(position) ? 9 : 0);
      newBoard.addTile(position, newTile);
    });

    // After all tiles are placed or updated, count the adjacent mines for each
    newBoard.map.forEach((tile, key) => {
      if (!tile.isMine()) {
        let mineCount = 0;
        const [row, col] = key.split("_").map(Number);

        // Count mines around this tile
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const neighbourPosition = new Position(row + i, col + j);
            const neighbourKey = neighbourPosition.getKey();
            if (newBoard.map.has(neighbourKey)) {
              const neighbourTile = newBoard.map.get(neighbourKey);
              if (neighbourTile.isMine()) {
                mineCount++;
              }
            }
          }
        }
        tile.adjacentMines = mineCount;
      }
    });

    return newBoard;
  };

  const revealAdjacentTiles = (board, row, col) => {
    let newBoard = Object.assign(board);
    let queue = [[row, col]];

    // BFS to reveal all connected empty tiles
    while (queue.length > 0) {
      let [currentRow, currentCol] = queue.shift();

      // Check adjacent tiles for expansion
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue; // Skip the current tile

          let newRow = currentRow + i;
          let newCol = currentCol + j;
          let newPosition = new Position(newRow, newCol);

          // Expand the board around this new position
          newBoard = expandBoard(newBoard, newRow, newCol);

          if (board.hasTile(newPosition)) {
            const adjacentTile = board.getTile(newPosition);

            if (
              !adjacentTile.isRevealed &&
              !adjacentTile.isMine() &&
              !adjacentTile.isFlagged
            ) {
              // Reveal this adjacent tile
              adjacentTile.isRevealed = true;
              board.addTile(newPosition, adjacentTile);

              // If the adjacent tile is also empty, add to the queue to reveal its adjacent tiles
              if (adjacentTile.isEmpty()) {
                queue.push([newRow, newCol]);
              }
            }
          }
        }
      }
    }

    return newBoard;
  };

  const revealTile = (row, col) => {
    setBoard((prevBoard) => {
      const position = new Position(row, col);
      const tile = prevBoard.getTile(position);

      // If the tile is already revealed or is flagged, then do nothing
      if (!tile || tile.isRevealed || tile.isFlagged) {
        return prevBoard;
      }

      let newBoard = Object.assign(prevBoard);
      newBoard = expandBoard(newBoard, row, col);

      const newTile = Object.assign(tile);

      // Reveal the clicked tile
      newTile.isRevealed = true;
      newBoard.addTile(position, newTile);

      if (newTile.isMine()) {
        // TODO: Handle the "game over" scenario
      } else if (newTile.isEmpty()) {
        // If the clicked tile is empty, reveal adjacent tiles
        newBoard = revealAdjacentTiles(newBoard, row, col);
      }

      return newBoard;
    });
  };

  const toggleFlag = (row, col) => {
    const position = new Position(row, col);

    // If the tile is revealed, then do nothing
    const tile = board.getTile(position);
    if (!tile || tile.isRevealed) {
      return;
    }

    let newBoard = Object.assign(board);
    tile.isFlagged = !board.getTile(position).isFlagged;
    newBoard.addTile(position, tile);

    setBoard(newBoard);
  };

  const handleChord = (row, col) => {
    const position = new Position(row, col);

    // If the tile doesn't exist, then do nothing
    if (!board.hasTile(position)) {
      return;
    }

    // Count the number of adjacent flagged tiles
    let flaggedAdjacent = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        const newPosition = new Position(newRow, newCol);
        if (board.getTile(newPosition).isFlagged) {
          flaggedAdjacent++;
        }
      }
    }

    // If the number of adjacent flags matches the number of adjacent mines, reveal adjacent tiles
    if (flaggedAdjacent === board.getTile(position).adjacentMines) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          const newPosition = new Position(newRow, newCol);
          if (
            !board.getTile(newPosition).isRevealed &&
            !board.getTile(newPosition).isFlagged
          ) {
            revealTile(newRow, newCol);
          }
        }
      }
    }
  };

  return (
    <div>
      <Board
        board={board}
        handleTileMouseDown={handleTileMouseDown}
        handleTileMouseUp={handleTileMouseUp}
      />
    </div>
  );
};

export default Game;
