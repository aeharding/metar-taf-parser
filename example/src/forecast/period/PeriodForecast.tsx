import styled from "@emotion/styled/macro";
import { IForecastContainer } from "metar-taf-parser";
import Forecast from "./Forecast";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0 0;
  max-width: 500px;
`;

interface ForecastProps {
  forecast: IForecastContainer;
}

export default function PeriodForecast({ forecast }: ForecastProps) {
  return (
    <Container>
      {forecast.forecast.map((forecast) => (
        <Forecast data={forecast} />
      ))}
    </Container>
  );
}
