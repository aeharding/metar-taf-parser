import { getReportDate } from "helpers/date";
import { TAFTrendDated } from "dates/taf";
import { WeatherChangeType } from "../model/enum";
import { ITAFDated } from "dates/taf";

export interface IForecastContainer {
  station: string;
  issued: Date;
  start: Date;
  end: Date;
  message: string;
  forecast: TAFTrendDated[];
}

export function getForecastFromTAF(taf: ITAFDated): IForecastContainer {
  return {
    issued: taf.issued,
    station: taf.station,
    message: taf.message,
    start: getReportDate(
      taf.issued,
      taf.validity.startDay,
      taf.validity.startHour
    ),
    end: getReportDate(taf.issued, taf.validity.endDay, taf.validity.endHour),
    forecast: [makeInitialForecast(taf), ...taf.trends],
  };
}

/**
 * Treat the base of the TAF as a FM
 */
function makeInitialForecast(taf: ITAFDated): TAFTrendDated {
  return {
    wind: taf.wind,
    visibility: taf.visibility,
    verticalVisibility: taf.verticalVisibility,
    windShear: taf.windShear,
    cavok: taf.cavok,
    remark: taf.remark,
    remarks: taf.remarks,
    clouds: taf.clouds,
    weatherConditions: taf.weatherConditions,
    validity: {
      // End day/hour are for end of the entire TAF
      startDay: taf.validity.startDay,
      startHour: taf.validity.startHour,
      startMinutes: 0,
      start: taf.validity.start,
    },
    type: WeatherChangeType.FM,
  };
}

interface ICompositeForecast {
  /**
   * The base forecast (type is `FM` or initial group)
   */
  base: TAFTrendDated;

  /**
   * Any forecast here should pre-empt the base forecast. These forecasts may
   * have probabilities of occuring, be temporary, or otherwise notable
   * precipitation events
   *
   * `type` is (`BECMG`, `TEMPO` or `PROB`)
   */
  additional: TAFTrendDated[];
}

export function getCompositeForecastForDate(
  date: Date,
  forecastContainer: IForecastContainer
): ICompositeForecast {
  // Validity bounds check
  if (
    date.getTime() > forecastContainer.end.getTime() ||
    date.getTime() < forecastContainer.start.getTime()
  )
    throw new Error("TODO useful error type");

  let base: TAFTrendDated | undefined;
  let additional: TAFTrendDated[] = [];

  for (let i = 0; i < forecastContainer.forecast.length; i++) {
    const forecast = forecastContainer.forecast[i];

    if (
      !forecast.validity.end &&
      forecast.validity.start.getTime() <= date.getTime()
    ) {
      // Is FM or initial forecast
      base = forecast;
    }

    if (
      forecast.validity.end &&
      forecast.validity.end.getTime() - date.getTime() > 0 &&
      forecast.validity.start.getTime() - date.getTime() <= 0
    ) {
      // Is BECMG or TEMPO
      additional.push(forecast);
    }
  }

  // TODO
  if (!base) throw new Error("broke!");

  return { base, additional };
}
