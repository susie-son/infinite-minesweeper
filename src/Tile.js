import styled from "styled-components";

export class TileInfo {
  constructor(adjacentMines = -1) {
    this.isRevealed = false;
    this.isFlagged = false;
    this.adjacentMines = adjacentMines;
  }

  isMine() {
    return this.adjacentMines === 9;
  }

  isEmpty() {
    return this.adjacentMines === 0;
  }
}

const StyledTile = styled.div`
  width: 50px;
  height: 50px;
  user-select: none;
  background: #fff6bd;
  padding: 0px;
  border: ${(props) =>
    props.tileStatus === "none" ? "1px solid #ffffff" : "1px groove #ebd6b7"};
`;

const StyledTileContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: ${(props) =>
    props.tileStatus === "reveal"
      ? "#e6cca5"
      : props.tileStatus === "hidden"
        ? "#6ec4c6"
        : "#ffffff"};
  color: #f395a5;
  border-radius: ${(props) => (props.tileStatus === "none" ? "0px" : "5px")};
  font-family: "Madimi One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20pt;
`;

const Tile = ({ tile }) => {
  const getTileStatus = () => {
    if (tile) {
      if (tile.isRevealed) return "reveal";
      return "hidden";
    }
    return "none";
  };

  const tileStatus = getTileStatus();

  const renderContent = () => {
    if (tile) {
      if (tile.isFlagged) return "🚩";
      if (tile.isRevealed) {
        if (tile.isMine()) return "💣";
        if (!tile.isEmpty()) return tile.adjacentMines;
      }
    }
    return "";
  };

  return (
    <StyledTile tileStatus={tileStatus}>
      <StyledTileContent tileStatus={tileStatus}>
        {renderContent()}
      </StyledTileContent>
    </StyledTile>
  );
};

export default Tile;
