import { useState } from 'react'
import BoardComponent, { Board, Position } from './Board'
import React from 'react'
import { Tile } from './Tile'
import styled from 'styled-components'

const GameWrapper = styled.div`
  background: #6ec4c6;
`

const Game = () => {
  const [board, setBoard] = useState(new Board())
  const [mouseButtons, setMouseButtons] = useState(0)

  // Returns whether a mine should be generated based on position
  const generateMine = (position: Position): boolean => {
    const { row, col } = position
    // Avoid placing mines too close to the origin
    if (row ** 2 + col ** 2 <= 2) return false
    return Math.random() < 0.2
  }

  const handleTileMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => {
    if (e.buttons === 2) {
      toggleFlag(row, col)
    }
    setMouseButtons(e.buttons)
  }

  const handleTileMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => {
    if (mouseButtons === 1 && e.buttons === 0) {
      revealTile(row, col)
    } else if (mouseButtons === 3) {
      handleChord(row, col)
    }
    setMouseButtons(0)
  }

  const expandBoard = (board: Board, row: number, col: number) => {
    let newBoard: Board = Object.assign(board)
    let queue: Position[] = []

    let offsets = [-1, 0, 1]

    // Iterate through neighbouring tiles
    offsets.forEach((i) => {
      offsets.forEach((j) => {
        if (i !== 0 || j !== 0) {
          const newRow = row + i
          const newCol = col + j
          const newPosition = new Position(newRow, newCol)

          // If no tile exists at this position, mark it for expansion
          if (!newBoard.hasTile(newPosition)) {
            queue.push(newPosition)
          }
        }
      })
    })

    // Add new tiles or update existing ones based on mine generation logic
    queue.forEach((position) => {
      // Use 9 to indicate a mine, otherwise use 0 to indicate an initially empty tile
      const newTile = new Tile(generateMine(position) ? 9 : 0)
      newBoard.addTile(position, newTile)
    })

    // After all tiles are placed or updated, count the adjacent mines for each
    newBoard.map.forEach((tile, key) => {
      if (!tile.isMine()) {
        let mineCount = 0
        const [row, col] = key.split('_').map(Number)

        // Count mines around this tile
        offsets.forEach((i) => {
          offsets.forEach((j) => {
            if (i !== 0 || j !== 0) {
              const neighbourPosition = new Position(row + i, col + j)
              const neighbourTile = newBoard.getTile(neighbourPosition)
              if (neighbourTile && neighbourTile.isMine()) {
                mineCount++
              }
            }
          })
        })
        tile.adjacentMines = mineCount
      }
    })

    return newBoard
  }

  const revealAdjacentTiles = (board: Board, row: number, col: number): Board => {
    let newBoard: Board = Object.assign(board)
    let queue = [[row, col]]

    // BFS to reveal all connected empty tiles
    while (queue.length) {
      let [currentRow, currentCol] = queue.shift()!

      let offsets = [-1, 0, 1]

      // Check adjacent tiles for expansion
      offsets.forEach((i) => {
        offsets.forEach((j) => {
          if (i !== 0 || j !== 0) {
            let newRow = currentRow + i
            let newCol = currentCol + j
            let newPosition = new Position(newRow, newCol)

            // Expand the board around this new position
            newBoard = expandBoard(newBoard, newRow, newCol)

            const adjacentTile = newBoard.getTile(newPosition)

            if (adjacentTile && !adjacentTile.isRevealed && !adjacentTile.isMine() && !adjacentTile.isFlagged) {
              // Reveal this adjacent tile
              adjacentTile.isRevealed = true
              newBoard.addTile(newPosition, adjacentTile)

              // If the adjacent tile is also empty, add to the queue to reveal its adjacent tiles
              if (adjacentTile.isEmpty()) {
                queue.push([newRow, newCol])
              }
            }
          }
        })
      })
    }

    return newBoard
  }

  const revealTile = (row: number, col: number) => {
    const position = new Position(row, col)
    const tile = board.getTile(position)

    // If the tile is already revealed or is flagged, then do nothing
    if (!tile || tile.isRevealed || tile.isFlagged) {
      return
    }

    let newBoard: Board = Object.assign(board)
    newBoard = expandBoard(newBoard, row, col)

    // Reveal the clicked tile
    tile.isRevealed = true
    newBoard.addTile(position, tile)

    if (tile.isMine()) {
      // TODO: Handle the "game over" scenario
    } else if (tile.isEmpty()) {
      // If the clicked tile is empty, reveal adjacent tiles
      newBoard = revealAdjacentTiles(newBoard, row, col)
    }

    setBoard(newBoard)
  }

  const toggleFlag = (row: number, col: number) => {
    const position = new Position(row, col)

    // If the tile is revealed, then do nothing
    const tile = board.getTile(position)
    if (!tile || tile.isRevealed) {
      return
    }

    let newBoard: Board = Object.assign(board)
    tile.isFlagged = !tile.isFlagged
    newBoard.addTile(position, tile)

    setBoard(newBoard)
  }

  const handleChord = (row: number, col: number) => {
    const position = new Position(row, col)
    const tile = board.getTile(position)

    const offsets = [-1, 0, 1]

    // If the tile doesn't exist or is not revealed, then do nothing
    if (!tile || !tile.isRevealed) {
      return
    }

    // Count the number of adjacent flagged tiles
    let flaggedAdjacent = 0
    offsets.forEach((i) => {
      offsets.forEach((j) => {
        if (i !== 0 || j !== 0) {
          const newRow = row + i
          const newCol = col + j
          const newPosition = new Position(newRow, newCol)
          const newTile = board.getTile(newPosition)
          if (newTile && newTile.isFlagged) {
            flaggedAdjacent++
          }
        }
      })
    })

    // If the number of adjacent flags matches the number of adjacent mines, reveal adjacent tiles
    if (flaggedAdjacent === tile.adjacentMines) {
      offsets.forEach((i) => {
        offsets.forEach((j) => {
          if (i !== 0 || j !== 0) {
            const newRow = row + i
            const newCol = col + j
            const newPosition = new Position(newRow, newCol)
            const newTile = board.getTile(newPosition)
            if (newTile && !newTile.isRevealed && !newTile.isFlagged) {
              revealTile(newRow, newCol)
            }
          }
        })
      })
    }
  }

  return (
    <GameWrapper>
      <BoardComponent board={board} handleTileMouseDown={handleTileMouseDown} handleTileMouseUp={handleTileMouseUp} />
    </GameWrapper>
  )
}

export default Game
