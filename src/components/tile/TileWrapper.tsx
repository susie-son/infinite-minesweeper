import styled from 'styled-components'

interface TileWrapperProps {
  $border: string
  $animationDelay: number
}

export const TileWrapper = styled.div.attrs<TileWrapperProps>((props) => ({
  style: {
    animation: `fadeIn 0.5s ease-out ${props.$animationDelay}ms backwards`
  }
}))`
  width: 50px;
  height: 50px;
  padding: 0px;
  border: ${(props) => props.$border};
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
