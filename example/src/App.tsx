import { css, Global } from "@emotion/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Parse from "./Parse";

const globalStyles = css`
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    max-width: 800px;
    margin: 0 auto;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <Global styles={globalStyles} />

      <div className="App">
        <header className="App-header">
          <h1>metar-taf-parser</h1>

          <Parse />
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
