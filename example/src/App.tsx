import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Parse from "./Parse";

const globalStyles = css`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background: rgb(14, 38, 60);
    color: white;

    max-width: 1000px;
    padding: 0 1rem 1rem;
    margin: 0 auto;
  }

  a {
    color: inherit;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;

const H1 = styled.h1`
  font-weight: 100;
`;

function App() {
  return (
    <BrowserRouter>
      <Global styles={globalStyles} />

      <div className="App">
        <header className="App-header">
          <H1>metar-taf-parser</H1>

          <p>
            Full documentation can be{" "}
            <a href="https://github.com/aeharding/metar-taf-parser">
              found on Github
            </a>
            . The package is{" "}
            <a href="https://www.npmjs.com/package/metar-taf-parser">
              available on npm
            </a>
            .
          </p>

          <Parse />
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
