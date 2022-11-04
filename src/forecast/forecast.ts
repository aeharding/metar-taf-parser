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
  const {
    trends,
    wind,
    visibility,
    verticalVisibility,
    windShear,
    cavok,
    remark,
    remarks,
    clouds,
    weatherConditions,
    initialRaw,
    validity,
    ...tafWithoutBaseProperties
  } = taf;

  return {
    ...tafWithoutBaseProperties,
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
      const { validity, ...trend } = currentTrend;

      forecasts.push({
        ...trend,

        start: currentTrend.validity.start,

        // Has a type and not a FM/BECMG/undefined, so always has an end
        end: currentTrend.validity.end!,
      } as Forecast);
      continue;
    }

    let forecast: Forecast;
    const { validity, ...trendWithoutValidity } = currentTrend;

    if (nextTrend === undefined) {
      forecast = hydrateWithPreviousContextIfNeeded(
        {
          ...trendWithoutValidity,

          start: currentTrend.validity.start,
          end: reportValidity.end,
          ...byIfNeeded(currentTrend),
        } as Forecast,
        previouslyHydratedTrend
      );
    } else {
      forecast = hydrateWithPreviousContextIfNeeded(
        {
          ...trendWithoutValidity,

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
  // BECMG is the only forecast type that inherits old conditions
  // Anything else starts anew
  if (forecast.type !== WeatherChangeType.BECMG || !context) return forecast;

  // Remarks should not be carried over
  context = { ...context };
  delete context.remark;
  context.remarks = [];

  // vertical visibility should not be carried over, if clouds exist
  if (forecast.clouds.length) delete context.verticalVisibility;

  // CAVOK should not propagate if anything other than wind changes
  if (
    forecast.clouds.length ||
    forecast.verticalVisibility ||
    forecast.weatherConditions.length ||
    forecast.visibility
  )
    delete context.cavok;

  forecast = {
    ...context,
    ...forecast,
  };

  if (!forecast.clouds.length) {
    forecast.clouds = context.clouds;
  }

  if (!forecast.weatherConditions.length)
    forecast.weatherConditions = context.weatherConditions;

  return forecast;
}

export interface ICompositeForecast {
  /**
   * Prevailing conditions: type is `FM`, `BECMG` or initial conditions (`undefined` type)
   */
  prevailing: Forecast;

  /**
   * supplemental forecasts may have probabilities of occuring, be temporary,
   * or otherwise notable change of conditions. They enhance the prevailing forecast.
   *
   * `type` is (`TEMPO`, `INTER` or `PROB`)
   */
  supplemental: Forecast[];
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

  let prevailing: Forecast | undefined;
  let supplemental: Forecast[] = [];

  for (const forecast of forecastContainer.forecast) {
    if (
      hasImplicitEnd(forecast) &&
      forecast.start.getTime() <= date.getTime()
    ) {
      // Is FM, BECMG or initial forecast
      prevailing = forecast;
    }

    if (
      !hasImplicitEnd(forecast) &&
      forecast.end &&
      forecast.end.getTime() - date.getTime() > 0 &&
      forecast.start.getTime() - date.getTime() <= 0
    ) {
      // Is TEMPO, INTER, PROB etc
      supplemental.push(forecast);
    }
  }

  if (!prevailing)
    throw new UnexpectedParseError("Unable to find trend for date");

  return { prevailing, supplemental };
}

function byIfNeeded(forecast: ForecastWithoutDates): { by?: Date } {
  if (forecast.type !== WeatherChangeType.BECMG) return {};

  return { by: forecast.validity.end };
}
