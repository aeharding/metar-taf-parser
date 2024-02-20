import styled from "@emotion/styled";
import { IForecastContainer } from "metar-taf-parser";
import Forecast from "./Forecast";

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

  width: 100%;

  gap: 1rem;
  margin: 1rem 0 0;
`;

interface ForecastProps {
  forecast: IForecastContainer;
}

export default function PeriodForecast({ forecast }: ForecastProps) {
  return (
    <Container>
      {forecast.forecast.map((forecast, index) => (
        <Forecast data={forecast} key={index} />
      ))}
    </Container>
  );
}
