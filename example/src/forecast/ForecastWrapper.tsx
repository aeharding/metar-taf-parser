import styled from "@emotion/styled";
import { Outlet, Route, Routes } from "react-router";
import FindForecast from "./FindForecast";
import ForecastResult from "./ForecastResult";

const Pre = styled.pre`
  display: inline;
  background: rgba(0, 0, 0, 0.5);
  padding: 3px 5px;
  border-radius: 3px;
`;

export default function ForecastWrapper() {
  return (
    <>
      <p>
        The Forecast API (<Pre>parseTAFAsForecast</Pre> &amp;{" "}
        <Pre>getCompositeForecastForDate</Pre>) is an abstraction on{" "}
        <Pre>parseTAF</Pre> that allows you to more easily show display TAF
        information and query conditions for a given javascript <Pre>Date</Pre>.
        Enter a ICAO airport code below to see an example of what this API makes
        possible.
      </p>

      <Routes>
        <Route path="" element={<FindForecast />} />
        <Route path=":icaoId" element={<ForecastResult />} />
      </Routes>

      <Outlet />
    </>
  );
}
