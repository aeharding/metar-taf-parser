import Hour, { Cell, Column } from "./Hour";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { eachHourOfInterval } from "date-fns";
import {
  getCompositeForecastForDate,
  ICompositeForecast,
  IForecastContainer,
} from "metar-taf-parser";

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

export interface IHour extends ICompositeForecast {
  hour: Date;
}

interface HourlyForecastProps {
  forecast: IForecastContainer;
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
  const [hours, setHours] = useState<IHour[]>(getHours(forecast));

  useEffect(() => {
    setHours(getHours(forecast));
  }, [forecast]);

  return (
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
  );
}

function getHours(forecast: IForecastContainer) {
  return eachHourOfInterval({
    start: forecast.start,
    end: forecast.end,
  })
    .slice(0, -1)
    .map((hour) => ({
      hour,
      ...getCompositeForecastForDate(hour, forecast),
    }));
}
