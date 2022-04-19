import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getCompositeForecastForDate,
  TAFTrendDated,
  IForecastContainer,
  parseTAFAsForecast,
} from "metar-taf-parser";
import * as noaa from "../services/noaa";
import { eachHourOfInterval, format, formatDistanceToNow } from "date-fns";
import Hour, { Cell, Column } from "./Hour";
import styled from "@emotion/styled";
import useInterval from "../helpers/useInterval";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Button = styled(Link)`
  display: inline-block;
  padding: 1rem;
  margin-bottom: 1rem;
  text-decoration: none;
  background: rgba(0, 0, 0, 0.4);
`;

export const Failed = styled.div`
  background: #8c0000;
  color: white;
  padding: 1rem;
`;

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
  const [error, setError] = useState<Error | undefined>();

  const updateIssued = useCallback(() => {
    if (!forecast) return;

    setIssuedRelative(
      formatDistanceToNow(forecast.issued, { addSuffix: true })
    );
  }, [forecast]);

  useEffect(() => {
    if (!icaoId) return;

    (async () => {
      let date: Date, rawTaf: string;

      try {
        [date, rawTaf] = await noaa.getTAF(icaoId);
      } catch (error) {
        if (error instanceof Error) setError(error);

        throw error;
      }

      const forecast = parseTAFAsForecast(rawTaf, { date });

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

  useEffect(() => {
    updateIssued();
  }, [forecast, updateIssued]);

  useInterval(
    () => {
      updateIssued();
    },
    forecast ? 1000 : null
  );

  const backButton = (
    <Button to="/forecast">
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </Button>
  );

  if (error)
    return (
      <div>
        {backButton}
        <Failed>
          Error loading TAF report. Is {icaoId} a valid US airport that produces
          a TAF report? (Otherwise the service may be down.)
        </Failed>
      </div>
    );
  if (!hours || !forecast) return <>Loading...</>;

  return (
    <>
      <p>
        {backButton}
        <br />
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

      <div>
        <Button to={`/taf?input=${encodeURIComponent(forecast.message)}`}>
          View parseTAF output
        </Button>
      </div>
    </>
  );
}
