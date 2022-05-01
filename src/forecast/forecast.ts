import { getReportDate } from "../helpers/date";
import { TAFTrendDated } from "../dates/taf";
import { ITAFDated } from "../dates/taf";
import { ParseError, UnexpectedParseError } from "../commons/errors";

/**
 * The initial forecast, extracted from the first line of the TAF, does not have
 * a trend type (FM, BECMG, etc)
 */
export type Forecast = Omit<TAFTrendDated, "type"> &
  Partial<Pick<TAFTrendDated, "type">>;

export interface IForecastContainer {
  station: string;
  issued: Date;
  start: Date;
  end: Date;
  message: string;
  forecast: Forecast[];
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
function makeInitialForecast(taf: ITAFDated): Forecast {
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
  };
}

export interface ICompositeForecast {
  /**
   * The base forecast (type is `FM` or initial group)
   */
  base: Forecast;

  /**
   * Any forecast here should pre-empt the base forecast. These forecasts may
   * have probabilities of occuring, be temporary, or otherwise notable
   * precipitation events
   *
   * `type` is (`BECMG`, `TEMPO` or `PROB`)
   */
  additional: Forecast[];
}

export class TimestampOutOfBoundsError extends ParseError {
  name = "TimestampOutOfBoundsError";

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
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
    throw new TimestampOutOfBoundsError(
      "Provided timestamp is outside the report validity period"
    );

  let base: Forecast | undefined;
  let additional: Forecast[] = [];

  for (const forecast of forecastContainer.forecast) {
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

  if (!base) throw new UnexpectedParseError("Unable to find trend for date");

  return { base, additional };
}
