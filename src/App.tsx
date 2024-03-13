import { createGlobalStyle } from 'styled-components'
import Game from './Game'

const GlobalStyle = createGlobalStyle`
  html, body {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    overflow: hidden;
    user-select: none;
  }
`

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Game />
    </>
  )
}

export default App
