import styled from "@emotion/styled";
import { format } from "date-fns";
import { CloudQuantity, ICloud, IWind, Visibility } from "metar-taf-parser";
import { IHour } from "./Forecast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faInfinity } from "@fortawesome/free-solid-svg-icons";
import Code from "./Code";
import Conditions from "./Conditions";

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

  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &:first-child {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const InfinityIcon = styled(FontAwesomeIcon)`
  font-size: 0.8em;
  opacity: 0.5;
`;
const WindIcon = styled(FontAwesomeIcon)<{ degrees: number }>`
  transform: rotate(${({ degrees }) => degrees}deg);

  margin-bottom: 0.5rem;
`;

interface HourProps {
  hour: IHour;
}

export default function Hour({ hour }: HourProps) {
  const windDirection =
    hour.additional[0]?.wind?.degrees != null
      ? hour.additional[0]?.wind?.degrees
      : hour.base.wind?.degrees;

  const ceiling = determineCeilingFromClouds([
    ...hour.additional.flatMap(({ clouds }) => clouds),
    ...hour.base.clouds,
  ]);

  return (
    <Column>
      <Cell>{format(hour.hour, "p")}</Cell>
      <Cell>
        <Code
          visibility={hour.additional[0]?.visibility || hour.base.visibility}
          ceiling={ceiling}
        />
      </Cell>
      <Cell>
        <Conditions hour={hour} />
      </Cell>
      <Cell>
        {ceiling != null ? (
          <>{ceiling} ft</>
        ) : (
          <InfinityIcon icon={faInfinity} />
        )}
      </Cell>
      <Cell>
        {formatVisibility(
          hour.additional[0]?.visibility || hour.base.visibility
        )}
      </Cell>
      <Cell>
        {windDirection != null && (
          <>
            <WindIcon degrees={windDirection} icon={faArrowDown} />
            {windDirection}°
          </>
        )}
      </Cell>
      <Cell>{formatWindSpeed(hour.additional[0]?.wind || hour.base.wind)}</Cell>
      <Cell>{formatWindGust(hour.additional[0]?.wind || hour.base.wind)}</Cell>
    </Column>
  );
}

function formatVisibility(visibility: Visibility | undefined): string {
  if (!visibility) return "";

  return `${visibility.value} mi`;
}

function formatWindSpeed(wind: IWind | undefined): string {
  if (!wind) return "";

  return `${wind.speed} ${wind.unit.toLowerCase()}`;
}

function formatWindGust(wind: IWind | undefined): string {
  if (!wind?.gust) return "";

  return `${wind.gust} ${wind.unit.toLowerCase()}`;
}

function determineCeilingFromClouds(clouds: ICloud[]): number | undefined {
  let ceiling: number | undefined;

  clouds.forEach((cloud) => {
    if (
      cloud.height != null &&
      (cloud.quantity === CloudQuantity.OVC ||
        cloud.quantity === CloudQuantity.BKN)
    ) {
      if (!ceiling || ceiling > cloud.height) ceiling = cloud.height;
    }
  });

  return ceiling;
}
