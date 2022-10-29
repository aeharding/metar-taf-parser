import styled from "@emotion/styled";
import { format } from "date-fns";
import { IWind, ValueIndicator, Visibility } from "metar-taf-parser";
import { IHour } from "./HourlyForecast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfinity } from "@fortawesome/free-solid-svg-icons";
import Code from "../Code";
import Conditions from "../Conditions";
import { determineCeilingFromClouds } from "../../helpers/metarTaf";
import WindIndicator from "../period/WindIndicator";
import { notEmpty } from "../../helpers/array";
import { sortBy } from "lodash";

export const Column = styled.div`
  width: 100px;
  flex-shrink: 0;

  // TODO not working well with start/end
  /* scroll-snap-align: start; */
`;

export const Cell = styled.div`
  height: 60px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-bottom: 1px solid #005693;

  &:first-of-type {
    border-top: 1px solid #005693;
  }
`;

const InfinityIcon = styled(FontAwesomeIcon)`
  font-size: 0.8em;
  opacity: 0.5;
`;

interface HourProps {
  hour: IHour;
}

export default function Hour({ hour }: HourProps) {
  const windDirection =
    hour.temporary[0]?.wind?.degrees != null
      ? hour.temporary[0]?.wind?.degrees
      : hour.prevailing.wind?.degrees;

  const clouds = [
    ...hour.temporary.flatMap(({ clouds }) => clouds),
    ...hour.prevailing.clouds,
  ];

  const ceiling = determineCeilingFromClouds(clouds)?.height;

  const minVisibility = sortBy(
    [
      hour.prevailing.visibility,
      ...hour.temporary.flatMap(({ visibility }) => visibility),
    ].filter(notEmpty),
    "value"
  )[0];

  return (
    <Column>
      <Cell>{format(hour.hour, "p")}</Cell>
      <Cell>
        <Code
          visibility={minVisibility}
          clouds={clouds}
          verticalVisibility={
            hour.temporary[0]?.verticalVisibility ??
            hour.prevailing.verticalVisibility
          }
        />
      </Cell>
      <Cell>
        <Conditions hour={hour} />
      </Cell>
      <Cell>
        {ceiling != null ? (
          <>{ceiling.toLocaleString()}ft</>
        ) : (
          <InfinityIcon icon={faInfinity} />
        )}
      </Cell>
      <Cell>{formatVisibility(minVisibility)}</Cell>
      <Cell>
        {windDirection != null && (
          <>
            <WindIndicator direction={windDirection} />
            {windDirection}°
          </>
        )}
      </Cell>
      <Cell>
        {formatWindSpeed(hour.temporary[0]?.wind || hour.prevailing.wind)}
      </Cell>
      <Cell>
        {formatWindGust(hour.temporary[0]?.wind || hour.prevailing.wind)}
      </Cell>
    </Column>
  );
}

function formatVisibility(visibility: Visibility | undefined): string {
  if (!visibility) return "";

  return [
    formatIndicator(visibility.indicator),
    visibility.value,
    visibility.unit,
  ].join(" ");
}

function formatIndicator(
  indicator: ValueIndicator | undefined
): string | undefined {
  switch (indicator) {
    case ValueIndicator.GreaterThan:
      return ">";
    case ValueIndicator.LessThan:
      return "<";
  }
}

function formatWindSpeed(wind: IWind | undefined): string {
  if (!wind) return "";

  return `${wind.speed} ${wind.unit.toLowerCase()}`;
}

function formatWindGust(wind: IWind | undefined): string {
  if (!wind?.gust) return "";

  return `${wind.gust} ${wind.unit.toLowerCase()}`;
}
