import styled from "@emotion/styled/macro";
import { IForecastContainer } from "metar-taf-parser";
import Forecast from "./Forecast";

const Container = styled.div``;

interface ForecastProps {
  forecast: IForecastContainer;
}

export default function PeriodForecast({ forecast }: ForecastProps) {
  return (
    <Container>
      {forecast.forecast.map((forecast) => (
        <Forecast forecast={forecast} />
      ))}
    </Container>
  );
}
