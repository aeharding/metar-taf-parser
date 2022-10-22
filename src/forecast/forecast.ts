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

type ForecastWithoutValidity = Omit<ForecastWithoutDates, "validity">;

export type Forecast = Omit<ForecastWithoutValidity, "type"> & {
  start: Date;
  end: Date;
} & (
    | {
        type: Exclude<WeatherChangeType, WeatherChangeType.BECMG> | undefined;
      }
    | {
        type: WeatherChangeType.BECMG;

        /**
         * BECMG has a special date, `by`, for when the transition will finish
         *
         * For example, a BECMG trend may `start` at 1:00PM and `end` at 5:00PM, but
         * `by` may be `3:00PM` to denote that conditions will transition from a period of
         * 1:00PM to 3:00PM
         */
        by: Date;
      }
  );

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

function hasImplicitEnd({ type }: ForecastWithoutDates | Forecast): boolean {
  return (
    type === WeatherChangeType.FM ||
    // BECMG are special - the "end" date in the validity isn't actually
    // the end date, it's when the change that's "becoming" is expected to
    // finish transition. The actual "end" date of the BECMG is determined by
    // the next FM/BECMG/end of the report validity, just like a FM
    type === WeatherChangeType.BECMG ||
    // Special case for beginning of report conditions
    type === undefined
  );
}

function hydrateEndDates(
  trends: ForecastWithoutDates[],
  reportValidity: IValidityDated
): Forecast[] {
  function findNext(index: number): ForecastWithoutDates | undefined {
    for (let i = index; i < trends.length; i++) {
      if (hasImplicitEnd(trends[i])) return trends[i];
    }
  }

  const forecasts: Forecast[] = [];

  let previouslyHydratedTrend: Forecast | undefined;

  for (let i = 0; i < trends.length; i++) {
    const currentTrend = trends[i];
    const nextTrend = findNext(i + 1);

    if (!hasImplicitEnd(currentTrend)) {
      forecasts.push({
        ...currentTrend,
        start: currentTrend.validity.start,

        // Has a type and not a FM/BECMG/undefined, so always has an end
        end: currentTrend.validity.end!,
      } as Forecast);
      continue;
    }

    let forecast: Forecast;

    if (nextTrend === undefined) {
      forecast = hydrateWithPreviousContextIfNeeded(
        {
          ...currentTrend,
          start: currentTrend.validity.start,
          end: reportValidity.end,
          ...byIfNeeded(currentTrend),
        } as Forecast,
        previouslyHydratedTrend
      );
    } else {
      forecast = hydrateWithPreviousContextIfNeeded(
        {
          ...currentTrend,
          start: currentTrend.validity.start,
          end: new Date(nextTrend.validity.start),
          ...byIfNeeded(currentTrend),
        } as Forecast,
        previouslyHydratedTrend
      );
    }

    forecasts.push(forecast);
    previouslyHydratedTrend = forecast;
  }

  return forecasts;
}

/**
 * BECMG doesn't always have all the context for the period, so
 * it needs to be populated
 */
function hydrateWithPreviousContextIfNeeded(
  forecast: Forecast,
  context: Forecast | undefined
): Forecast {
  if (forecast.type !== WeatherChangeType.BECMG || !context) return forecast;

  // Remarks should not be carried over
  context = { ...context };
  delete context.remark;
  context.remarks = [];

  forecast = {
    ...context,
    ...forecast,
  };

  if (!forecast.clouds.length) forecast.clouds = context.clouds;
  if (!forecast.weatherConditions.length)
    forecast.weatherConditions = context.weatherConditions;

  return forecast;
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
      hasImplicitEnd(forecast) &&
      forecast.start.getTime() <= date.getTime()
    ) {
      // Is FM or initial forecast
      base = forecast;
    }

    if (
      !hasImplicitEnd(forecast) &&
      forecast.end &&
      forecast.end.getTime() - date.getTime() > 0 &&
      forecast.start.getTime() - date.getTime() <= 0
    ) {
      // Is TEMPO, BECMG etc
      additional.push(forecast);
    }
  }

  if (!base) throw new UnexpectedParseError("Unable to find trend for date");

  return { base, additional };
}

function byIfNeeded(forecast: ForecastWithoutDates): { by?: Date } {
  if (forecast.type !== WeatherChangeType.BECMG) return {};

  return { by: forecast.validity.end };
}
