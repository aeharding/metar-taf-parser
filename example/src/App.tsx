import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import { ParseMetar, ParseTAF } from "./Parse";
import pjson from "metar-taf-parser/package.json";

const globalStyles = css`
  html {
    box-sizing: border-box;

    height: 100%;
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
    padding: 0 1rem;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #root {
    flex: 1;

    display: flex;
    flex-direction: column;
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

const Footer = styled.footer`
  margin-top: auto;
  text-align: center;
  padding: 1rem 0;
  opacity: 0.5;
`;

function App() {
  return (
    <BrowserRouter basename="/metar-taf-parser">
      <Global styles={globalStyles} />

      <header>
        <H1>metar-taf-parser</H1>
      </header>

      <div>
        Full documentation can be{" "}
        <a href="https://github.com/aeharding/metar-taf-parser">
          found on Github
        </a>
        . The package is{" "}
        <a href="https://www.npmjs.com/package/metar-taf-parser">
          available on npm
        </a>
        .
      </div>

      <Routes>
        <Route path="/metar" element={<ParseMetar />} />
        <Route path="/taf" element={<ParseTAF />} />
        <Route path="*" element={<Navigate to="/metar" replace />} />
      </Routes>

      <Footer>metar-taf-parser v{pjson.version}</Footer>
    </BrowserRouter>
  );
}

export default App;
