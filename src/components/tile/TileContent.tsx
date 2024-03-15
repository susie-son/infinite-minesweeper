import styled from 'styled-components'

interface TileContentProps {
  $textColour: string
  $background: string
  $hoverBackground: string
  $borderRadius: string
  $hoverCursor: string
  $animation: string
}
export const TileContent = styled.div<TileContentProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: ${(props) => props.$background};
  color: ${(props) => props.$textColour};
  border-radius: ${(props) => props.$borderRadius};
  font-family: 'Madimi One', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20pt;
  transition:
    background-color 0.3s ease,
    transform 0.5s;
  &:hover {
    background: ${(props) => props.$hoverBackground};
    cursor: ${(props) => props.$hoverCursor};
  }
  &:active {
    transform: scale(0.95);
  }
  animation: ${(props) => props.$animation};
  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`
