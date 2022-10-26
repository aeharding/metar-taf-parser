import { Forecast as TForecast } from "metar-taf-parser";

interface ForecastProps {
  forecast: TForecast;
}

export default function Forecast({ forecast }: ForecastProps) {
  return <>Forecast!</>;
}
