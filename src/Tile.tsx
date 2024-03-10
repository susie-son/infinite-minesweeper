import React, { useEffect, useState } from "react";
import styled from "styled-components";

export class Tile {
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;

  constructor(adjacentMines = 0) {
    this.isRevealed = false;
    this.isFlagged = false;
    this.adjacentMines = adjacentMines;
  }

  isMine(): boolean {
    return this.adjacentMines === 9;
  }

  isEmpty(): boolean {
    return this.adjacentMines === 0;
  }
}

interface TileWrapperProps {
  $border: string;
}

const TileWrapper = styled.div<TileWrapperProps>`
  width: 50px;
  height: 50px;
  user-select: none;
  background: #fff6bd;
  padding: 0px;
  border: ${(props) => props.$border};
`;

interface TileContentProps {
  $background: string;
  $borderRadius: string;
}

const TileContent = styled.div<TileContentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: ${(props) => props.$background};
  color: #f395a5;
  border-radius: ${(props) => props.$borderRadius};
  font-family: "Madimi One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20pt;
`;

enum TileState {
  Reveal,
  Hidden,
  None,
}

interface TileComponentProps {
  tile: Tile | undefined;
}

const TileComponent = ({ tile }: TileComponentProps) => {
  const [tileState, setTileState] = useState(TileState.None);

  const getTileSymbol = () => {
    if (tile) {
      if (tile.isFlagged) return "🚩";
      if (tile.isRevealed) {
        if (tile.isMine()) return "💣";
        if (!tile.isEmpty()) return tile.adjacentMines;
      }
    }
    return "";
  };

  const getBorder = (): string => {
    switch (tileState) {
      case TileState.None:
        return "1px solid #ffffff";
      default:
        return "1px groove #ebd6b7";
    }
  };

  const getBackground = (): string => {
    switch (tileState) {
      case TileState.Reveal:
        return "#e6cca5";
      case TileState.Hidden:
        return "#6ec4c6";
      default:
        return "#ffffff";
    }
  };

  const getBorderRadius = (): string => {
    switch (tileState) {
      case TileState.None:
        return "0px";
      default:
        return "5px";
    }
  };

  useEffect(() => {
    if (tile) {
      setTileState(tile.isRevealed ? TileState.Reveal : TileState.Hidden);
    } else {
      setTileState(TileState.None);
    }
  }, [tile, tile?.isRevealed]);

  return (
    <TileWrapper $border={getBorder()}>
      <TileContent
        $background={getBackground()}
        $borderRadius={getBorderRadius()}
      >
        {getTileSymbol()}
      </TileContent>
    </TileWrapper>
  );
};

export default TileComponent;
