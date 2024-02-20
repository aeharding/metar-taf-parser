import styled from "@emotion/styled";
import { format } from "date-fns";
import HourlyForecast from "./hourly/HourlyForecast";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { IForecastContainer, parseTAFAsForecast } from "metar-taf-parser";
import * as noaa from "../services/noaa";
import { formatDistanceToNow } from "date-fns";
import useInterval from "../helpers/useInterval";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PeriodForecast from "./period/PeriodForecast";

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

const RawReport = styled.div`
  display: inline-flex;
  padding: 1rem;
  margin: 1rem 0;

  white-space: pre-line;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.2);
`;

export default function ForecastResult() {
  const { icaoId } = useParams<"icaoId">();
  const [forecast, setForecast] = useState<IForecastContainer | undefined>();
  const [issuedRelative, setIssuedRelative] = useState("");
  const [error, setError] = useState<Error | undefined>();

  const updateIssued = useCallback(() => {
    if (!forecast) return;

    setIssuedRelative(
      formatDistanceToNow(forecast.issued, { addSuffix: true }),
    );
  }, [forecast]);

  useEffect(() => {
    if (!icaoId) return;

    (async () => {
      let issued: Date, rawTaf: string;

      try {
        [issued, rawTaf] = await noaa.getTAF(icaoId);
      } catch (error) {
        if (error instanceof Error) setError(error);

        throw error;
      }

      const forecast = parseTAFAsForecast(rawTaf, { issued });

      setForecast(forecast);
    })();
  }, [icaoId]);

  useEffect(() => {
    updateIssued();
  }, [forecast, updateIssued]);

  useInterval(
    () => {
      updateIssued();
    },
    forecast ? 1000 : null,
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
          Error loading TAF report. Is {icaoId} a valid airport that produces a
          TAF report? (Otherwise the service may be down.)
        </Failed>
      </div>
    );

  if (!forecast) return <>Loading...</>;

  return (
    <>
      <p>
        {backButton}
        <br />
        Station: {forecast.station}
        <br />
        TAF issued: {format(forecast.issued, "Pp")} ({issuedRelative})
      </p>

      <div>
        <RawReport>{forecast.message}</RawReport>
      </div>

      <div>
        <Button to={`/taf?input=${encodeURIComponent(forecast.message)}`}>
          View parseTAF output
        </Button>
      </div>

      <HourlyForecast forecast={forecast} />

      <PeriodForecast forecast={forecast} />
    </>
  );
}
