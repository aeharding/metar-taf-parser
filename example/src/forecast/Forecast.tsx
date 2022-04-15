import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  parseTAF,
  getForecastFromTAF,
  getCompositeForecastForDate,
  TAFTrendDated,
  IForecastContainer,
} from "metar-taf-parser";
import * as noaa from "../services/noaa";
import { eachHourOfInterval, format, formatDistanceToNow } from "date-fns";
import Hour, { Cell, Column } from "./Hour";
import styled from "@emotion/styled";
import useInterval from "../helpers/useInterval";

const HoursTable = styled.div`
  display: flex;
  overflow-x: auto;
  text-align: center;

  scroll-snap-type: x mandatory;
`;

const StickyColumn = styled(Column)`
  position: sticky;
  left: 0;
  z-index: 1;

  font-weight: 500;
  text-align: left;
  backdrop-filter: blur(3px);
  background: linear-gradient(
    to right,
    rgba(14, 38, 60, 1),
    rgba(14, 38, 60, 0.8)
  );
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.2);

  > div {
    align-items: flex-start;
    padding-left: 1rem;
  }
`;

const RawReport = styled.div`
  display: inline-flex;
  padding: 1rem;
  margin: 1rem 0;

  white-space: pre-line;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.2);
`;

export interface IHour {
  base: TAFTrendDated;
  additional: TAFTrendDated[];
  hour: Date;
}

export default function Forecast() {
  const { icaoId } = useParams<"icaoId">();
  const [forecast, setForecast] = useState<IForecastContainer | undefined>();
  const [hours, setHours] = useState<IHour[] | undefined>();
  const [issuedRelative, setIssuedRelative] = useState("");

  useEffect(() => {
    if (!icaoId) return;
    (async () => {
      const [date, rawTaf] = await noaa.getTAF(icaoId);
      const taf = parseTAF(rawTaf, { date });
      const forecast = getForecastFromTAF(taf);

      const forecastPerHour = eachHourOfInterval({
        start: forecast.start,
        end: forecast.end,
      })
        .slice(0, -1)
        .map((hour) => ({
          hour,
          ...getCompositeForecastForDate(hour, forecast),
        }));

      setForecast(forecast);
      setHours(forecastPerHour);
    })();
  }, [icaoId]);

  useInterval(
    () => {
      if (!forecast) return;

      setIssuedRelative(
        formatDistanceToNow(forecast.issued, { addSuffix: true })
      );
    },
    forecast ? 1000 : null
  );

  if (!hours || !forecast) return <>Loading...</>;

  return (
    <>
      <p>
        Station: {forecast.station}
        <br />
        TAF issued: {format(forecast.issued, "Pp")} ({issuedRelative})
      </p>

      <HoursTable>
        <StickyColumn>
          <Cell>Hour</Cell>
          <Cell>Code</Cell>
          <Cell>Weather</Cell>
          <Cell>Ceiling</Cell>
          <Cell>Visibility</Cell>
          <Cell>Wind</Cell>
          <Cell>Speed</Cell>
          <Cell>Gust</Cell>
        </StickyColumn>
        {hours.map((hour, index) => (
          <Hour hour={hour} key={index} />
        ))}
      </HoursTable>

      <div>
        <RawReport>{forecast.message}</RawReport>
      </div>
    </>
  );
}
