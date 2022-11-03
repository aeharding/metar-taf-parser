import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { format, startOfTomorrow } from "date-fns";
import {
  Forecast as IForecast,
  Intensity,
  IWeatherCondition,
  WeatherChangeType,
} from "metar-taf-parser";
import React from "react";
import { notEmpty } from "../../helpers/array";
import {
  determineCeilingFromClouds,
  formatDescriptive,
  formatIcingIntensity,
  formatIntensity,
  formatPhenomenon,
  formatTurbulenceIntensity,
  formatVisibility,
  formatWind,
} from "../../helpers/metarTaf";
import { capitalizeFirstLetter } from "../../helpers/string";
import Code from "../Code";
import Cloud from "./Cloud";
import WindIndicator from "./WindIndicator";

const Container = styled.div<{ type: WeatherChangeType | undefined }>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  background: #0095ff10;
  border: 1px solid;
  border-radius: 1rem;

  ${({ type }) => {
    switch (type) {
      case undefined:
      case WeatherChangeType.FM:
      case WeatherChangeType.BECMG:
      default:
        return css`
          border-color: #005693;
        `;
      case WeatherChangeType.PROB:
      case WeatherChangeType.TEMPO:
        return css`
          border-color: transparent;
        `;
    }
  }}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: -0.25rem;
`;

const Text = styled.p`
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;

  margin: auto 0;

  td {
    vertical-align: top;

    &:nth-of-type(1) {
      text-align: right;
      width: 35%;
      padding-right: 2rem;
      opacity: 0.7;
    }
  }
`;

const Raw = styled.div`
  padding: 0.5rem 1rem;

  background: rgba(0, 0, 0, 0.5);
  font-family: monospace;
  border-radius: 0.5rem;
`;

interface ForecastProps {
  data: IForecast;
}

export default function Forecast({ data }: ForecastProps) {
  const ceiling = determineCeilingFromClouds(data.clouds);
  const periodRemark = getPeriodRemark(data);

  function formatType(type: WeatherChangeType | undefined): string {
    switch (type) {
      case WeatherChangeType.FM:
      case undefined:
        return "From";
      case WeatherChangeType.BECMG:
        return "Becoming";
      case WeatherChangeType.PROB:
        return `${data.probability}% Chance`;
      case WeatherChangeType.TEMPO:
        return "Temporarily";
      case WeatherChangeType.INTER:
        return "Intermittently";
    }
  }

  return (
    <Container type={data.type}>
      <Header>
        <Text>
          {formatType(data.type)}{" "}
          {data.probability && data.type !== WeatherChangeType.PROB
            ? `(${data.probability}% chance) `
            : undefined}{" "}
          {formatWithTomorrowIfNeeded(data.start, "p")}{" "}
          {data.end ? <>to {formatWithTomorrowIfNeeded(data.end, "p")}</> : ""}
        </Text>

        {(data.visibility &&
          (data.clouds.length || data.verticalVisibility != null)) ||
        data.cavok ? (
          <Code
            visibility={data.visibility}
            clouds={data.clouds}
            verticalVisibility={data.verticalVisibility}
          />
        ) : (
          ""
        )}
      </Header>

      <Table>
        <tbody>
          {periodRemark && (
            <tr>
              <td>Period</td>
              <td>{periodRemark}</td>
            </tr>
          )}
          {data.wind && (
            <tr>
              <td>Wind</td>
              <td>
                {data.wind.speed && data.wind.direction ? (
                  <>
                    {data.wind.degrees != null ? (
                      <>
                        {data.wind.degrees}°{" "}
                        <WindIndicator direction={data.wind.degrees} />
                      </>
                    ) : (
                      "Variable"
                    )}{" "}
                    at {formatWind(data.wind.speed, data.wind.unit)}{" "}
                  </>
                ) : (
                  <>Calm</>
                )}{" "}
                {data.wind.gust != null && (
                  <>
                    <br />
                    Gusting to {formatWind(data.wind.gust, data.wind.unit)}
                  </>
                )}
              </td>
            </tr>
          )}
          {data.windShear && (
            <tr>
              <td>Wind Shear</td>
              <td>
                {data.windShear.degrees ? (
                  <>
                    {data.windShear.degrees}{" "}
                    <WindIndicator direction={data.windShear.degrees} /> at{" "}
                  </>
                ) : (
                  "Variable direction at"
                )}{" "}
                {formatWind(data.windShear.speed, data.windShear.unit)}{" "}
                {data.windShear.gust != null ? (
                  <>
                    gusting to{" "}
                    {formatWind(data.windShear.gust, data.windShear.unit)}
                  </>
                ) : (
                  ""
                )}{" "}
                at {data.windShear.height.toLocaleString()} ft AGL
              </td>
            </tr>
          )}
          {data.clouds.length || data.verticalVisibility != null ? (
            <tr>
              <td>Clouds</td>
              <td>
                {data.clouds.map((cloud, index) => (
                  <React.Fragment key={index}>
                    <Cloud data={cloud} />
                    <br />
                  </React.Fragment>
                ))}
                {data.verticalVisibility != null ? (
                  <>Obscured sky</>
                ) : undefined}
              </td>
            </tr>
          ) : (
            ""
          )}
          {data.visibility && (
            <tr>
              <td>Visibility</td>
              <td>
                {formatVisibility(data.visibility)}{" "}
                {data.visibility.ndv && "No directional visibility"}{" "}
              </td>
            </tr>
          )}

          {data.visibility &&
          (data.clouds.length || data.verticalVisibility != null) ? (
            <tr>
              <td>Ceiling</td>
              <td>
                {ceiling
                  ? `${ceiling.height?.toLocaleString()} ft AGL`
                  : data.verticalVisibility
                  ? `Vertical visibility ${data.verticalVisibility.toFixed()} ft AGL`
                  : "At least 12,000 ft AGL"}
              </td>
            </tr>
          ) : (
            ""
          )}

          {data.weatherConditions.length ? (
            <tr>
              <td>Weather</td>
              <td>{formatWeather(data.weatherConditions)}</td>
            </tr>
          ) : undefined}

          {data.remarks.length ? (
            <tr>
              <td>Remarks</td>
              <td>
                {data.remarks.map((remark) => (
                  <>
                    {remark.description || remark.raw}
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ) : undefined}

          {data.turbulence ? (
            <tr>
              <td>Turbulence</td>
              <td>
                {data.turbulence.map((turbulence) => (
                  <>
                    {formatTurbulenceIntensity(turbulence.intensity)} from{" "}
                    {turbulence.baseHeight
                      ? turbulence.baseHeight.toLocaleString()
                      : "surface"}{" "}
                    to{" "}
                    {(
                      turbulence.baseHeight + turbulence.depth
                    ).toLocaleString()}{" "}
                    ft AGL.
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ) : undefined}

          {data.icing ? (
            <tr>
              <td>Icing</td>
              <td>
                {data.icing.map((icing) => (
                  <>
                    {formatIcingIntensity(icing.intensity)} from{" "}
                    {icing.baseHeight
                      ? icing.baseHeight.toLocaleString()
                      : "surface"}{" "}
                    to {(icing.baseHeight + icing.depth).toLocaleString()} ft
                    AGL.
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ) : undefined}
        </tbody>
      </Table>
      <Raw>{data.raw}</Raw>
    </Container>
  );
}

function formatWeather(weather: IWeatherCondition[]): React.ReactNode {
  return (
    <>
      {capitalizeFirstLetter(
        weather
          .map((condition) =>
            [
              condition.intensity !== Intensity.IN_VICINITY
                ? formatIntensity(condition.intensity)
                : undefined,
              formatDescriptive(
                condition.descriptive,
                !!condition.phenomenons.length
              ),
              condition.phenomenons
                .map((phenomenon) => formatPhenomenon(phenomenon))
                .join("/"),
              condition.intensity === Intensity.IN_VICINITY
                ? formatIntensity(condition.intensity)
                : undefined,
            ]
              .filter(notEmpty)
              .join(" ")
          )
          .join(", ")
          .toLowerCase()
          .trim()
      )}
    </>
  );
}

function getPeriodRemark(forecast: IForecast): string | undefined {
  switch (forecast.type) {
    case WeatherChangeType.BECMG:
      return `Conditions expected to become as follows by ${formatWithTomorrowIfNeeded(
        forecast.by,
        "p"
      )}.`;
    case WeatherChangeType.TEMPO:
      return "The following changes expected for less than half the time period.";
  }
}

export function formatWithTomorrowIfNeeded(
  date: Date,
  formatStr: string
): string {
  return `${format(date, formatStr)}${
    new Date(date).getTime() >= startOfTomorrow().getTime() ? " tomorrow" : ""
  }`;
}
