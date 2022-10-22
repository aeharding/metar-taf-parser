import { getReportDate } from "helpers/date";
import { TAFTrendDated } from "dates/taf";
import { ITAFDated } from "dates/taf";
import { ParseError, UnexpectedParseError } from "commons/errors";
import { IValidityDated, IFlags, ITemperatureDated } from "model/model";
import { WeatherChangeType } from "model/enum";

/**
 * The initial forecast, extracted from the first line of the TAF, does not have
 * a trend type (FM, BECMG, etc)
 */
type ForecastWithoutDates = Omit<TAFTrendDated, "type"> &
  Partial<Pick<TAFTrendDated, "type">>;

export type Forecast = ForecastWithoutDates & {
  start: Date;
  end: Date;
};

export interface IForecastContainer extends IFlags {
  station: string;
  issued: Date;
  start: Date;
  end: Date;
  message: string;
  forecast: Forecast[];
  amendment?: true;

  maxTemperature?: ITemperatureDated;
  minTemperature?: ITemperatureDated;
}

export function getForecastFromTAF(taf: ITAFDated): IForecastContainer {
  return {
    ...taf,
    start: getReportDate(
      taf.issued,
      taf.validity.startDay,
      taf.validity.startHour
    ),
    end: getReportDate(taf.issued, taf.validity.endDay, taf.validity.endHour),
    forecast: hydrateEndDates(
      [makeInitialForecast(taf), ...taf.trends],
      taf.validity
    ),
  };
}

/**
 * Treat the base of the TAF as a FM
 */
function makeInitialForecast(taf: ITAFDated): ForecastWithoutDates {
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
    raw: taf.initialRaw,
    validity: {
      // End day/hour are for end of the entire TAF
      startDay: taf.validity.startDay,
      startHour: taf.validity.startHour,
      startMinutes: 0,
      start: taf.validity.start,
    },
  };
}

function hydrateEndDates(
  trends: ForecastWithoutDates[],
  reportValidity: IValidityDated
): Forecast[] {
  const fms = trends.filter(
    ({ type }) =>
      type === WeatherChangeType.FM ||
      type === WeatherChangeType.BECMG ||
      type === undefined
  );
  const others: Forecast[] = trends
    .filter(
      ({ type }) =>
        type &&
        type !== WeatherChangeType.FM &&
        type !== WeatherChangeType.BECMG
    )
    .map((other) => ({
      ...other,
      start: other.validity.start,
      end: other.validity.end!, // TODO TODO TEMP!!!)(&R#(*YR*(EFHIDCNKSJCHSDKJH)))
    }));

  const forecasts: Forecast[] = [];

  for (let i = 0; i < fms.length; i++) {
    const initialTrend = fms[i];
    const nextTrend = fms[i + 1];

    if (nextTrend === undefined) {
      forecasts.push({
        ...initialTrend,
        start: initialTrend.validity.start,
        end: reportValidity.end,
      });
      continue;
    }

    forecasts.push({
      ...initialTrend,
      start: initialTrend.validity.start,
      end: new Date(nextTrend.validity.start),
    });
  }

  return [...forecasts, ...others].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
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
      (forecast.type === WeatherChangeType.FM ||
        forecast.type === WeatherChangeType.BECMG ||
        forecast.type === undefined) &&
      forecast.validity.start.getTime() <= date.getTime()
    ) {
      // Is FM, BECMG or initial forecast
      base = forecast;
    }

    if (
      forecast.type &&
      forecast.type !== WeatherChangeType.FM &&
      forecast.type !== WeatherChangeType.BECMG &&
      forecast.validity.end &&
      forecast.validity.end.getTime() - date.getTime() > 0 &&
      forecast.validity.start.getTime() - date.getTime() <= 0
    ) {
      // Is TEMPO etc
      additional.push(forecast);
    }
  }

  if (!base) throw new UnexpectedParseError("Unable to find trend for date");

  return { base, additional };
}
