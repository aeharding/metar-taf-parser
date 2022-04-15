import styled from "@emotion/styled";
import { IWeatherCondition } from "../../../dist";
import { IHour } from "./Forecast";

const Nothing = styled.div`
  opacity: 0.5;
  font-size: 0.8em;
`;

interface ConditionsProp {
  hour: IHour;
}

export default function Conditions({ hour }: ConditionsProp) {
  const allConditions = [hour.base, ...hour.additional].flatMap(
    (forecast) => forecast.weatherConditions
  );

  return allConditions.length > 0 ? (
    <>
      {allConditions.map((condition, index) => (
        <Condition weatherCondition={condition} key={index} />
      ))}
    </>
  ) : (
    <Nothing>No current phenomenon</Nothing>
  );
}

function Condition({
  weatherCondition,
}: {
  weatherCondition: IWeatherCondition;
}) {
  return <div>{formatCondition(weatherCondition)}</div>;
}

function formatCondition(condition: IWeatherCondition): string {
  const phenomenons = condition.phenomenons.join(", ");

  return [condition.intensity, condition.descriptive, phenomenons].join(" ");
}
