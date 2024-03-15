import React, { memo, useEffect, useMemo, useRef } from 'react'
import TileComponent from '../tile/TileComponent'
import { Board } from '../../Board'
import { BoardWrapper } from './BoardWrapper'
import { RowWrapper } from './RowWrapper'
import { ANIMATION_REVEAL_DELAY_MULTIPLIER } from '../../constants'

interface BoardComponentProps {
  board: Board
  handleTileMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => void
  handleTileMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => void
}

const BoardComponent = ({ board, handleTileMouseDown, handleTileMouseUp }: BoardComponentProps) => {
  const grid = useMemo(() => board.generateGrid(), [board])
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
  }, [])

  return (
    <BoardWrapper>
      {grid.map((row, rowIndex: number) => {
        const adjustedRowIndex = rowIndex + board.minRow
        return (
          <RowWrapper key={adjustedRowIndex}>
            {row.map((tile, colIndex) => {
              const adjustedColIndex = colIndex + board.minCol
              const delay = firstRender.current
                ? (rowIndex * grid.length + colIndex) * ANIMATION_REVEAL_DELAY_MULTIPLIER
                : 0
              return (
                <TileComponent
                  key={`${adjustedRowIndex}-${adjustedColIndex}`}
                  tile={tile}
                  neighbourTypes={board.getNeighbourTypes(adjustedRowIndex, adjustedColIndex)}
                  handleTileMouseDown={handleTileMouseDown}
                  handleTileMouseUp={handleTileMouseUp}
                  $animationDelay={delay}
                  adjustedRowIndex={adjustedRowIndex}
                  adjustedColIndex={adjustedColIndex}
                />
              )
            })}
          </RowWrapper>
        )
      })}
    </BoardWrapper>
  )
}

export default memo(BoardComponent)
