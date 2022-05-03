import { IMetar, ITAF } from "./model/model";
import { MetarParser, TAFParser } from "./parser/parser";
import { ParseError, InvalidWeatherStatementError } from "./commons/errors";
import { Locale } from "./commons/i18n";
import { IMetarDated, metarDatesHydrator } from "./dates/metar";
import { ITAFDated, tafDatesHydrator } from "./dates/taf";
import { getForecastFromTAF, IForecastContainer } from "./forecast/forecast";
import en from "./locale/en";

export { Locale } from "./commons/i18n";
export * from "./commons/errors";
export * from "./model/model";
export * from "./model/enum";
export {
  RemarkType,
  // Special remarks
  IBaseRemark,
  IUnknownRemark,
  Remark,
  // Rest of remark types
  ICeilingHeightRemark,
  ICeilingSecondLocationRemark,
  IHourlyMaximumMinimumTemperatureRemark,
  IHourlyMaximumTemperatureRemark,
  IHourlyMinimumTemperatureRemark,
  IHourlyPrecipitationAmountRemark,
  IHourlyPressureRemark,
  IHourlyTemperatureDewPointRemark,
  IIceAccretionRemark,
  IObscurationRemark,
  IPrecipitationAmount24HourRemark,
  IPrecipitationAmount36HourRemark,
  IPrecipitationBegEndRemark,
  IPrevailingVisibilityRemark,
  ISeaLevelPressureRemark,
  ISecondLocationVisibilityRemark,
  ISectorVisibilityRemark,
  ISmallHailSizeRemark,
  ISnowIncreaseRemark,
  ISnowPelletsRemark,
  ISunshineDurationRemark,
  ISurfaceVisibilityRemark,
  IThunderStormLocationRemark,
  IThunderStormLocationMovingRemark,
  ITornadicActivityBegRemark,
  ITornadicActivityBegEndRemark,
  ITornadicActivityEndRemark,
  ITowerVisibilityRemark,
  IVariableSkyRemark,
  IVariableSkyHeightRemark,
  IVirgaDirectionRemark,
  IWaterEquivalentSnowRemark,
  IWindPeakCommandRemark,
  IWindShiftFropaRemark,
} from "./command/remark";
export {
  getCompositeForecastForDate,
  IForecastContainer,
  ICompositeForecast,
  Forecast,
  TimestampOutOfBoundsError,
} from "./forecast/forecast";
export { TAFTrendDated, ITAFDated } from "./dates/taf";

export interface IMetarTAFParserOptions {
  locale?: Locale;
}

export interface IMetarTAFParserOptionsDated extends IMetarTAFParserOptions {
  /**
   * This date should ideally be the date the report was issued. Otherwise, it
   * can be be +/- one week of the actual report date and work properly.
   *
   * So if you know the report was recently issued, you can pass `new Date()`
   *
   * This date is needed to create actual timestamps since the report only has
   * day of month, hour, and minute.
   */
  date: Date;
}

export function parseMetar(
  rawMetar: string,
  options?: IMetarTAFParserOptions
): IMetar;
export function parseMetar(
  rawMetar: string,
  options?: IMetarTAFParserOptionsDated
): IMetarDated;
export function parseMetar(
  rawMetar: string,
  options?: IMetarTAFParserOptions | IMetarTAFParserOptionsDated
): IMetar | IMetarDated {
  return parse(rawMetar, options, MetarParser, metarDatesHydrator);
}

export function parseTAF(
  rawTAF: string,
  options?: IMetarTAFParserOptions
): ITAF;
export function parseTAF(
  rawTAF: string,
  options?: IMetarTAFParserOptionsDated
): ITAFDated;
export function parseTAF(
  rawTAF: string,
  options?: IMetarTAFParserOptions
): ITAF | ITAFDated {
  return parse(rawTAF, options, TAFParser, tafDatesHydrator);
}

export function parseTAFAsForecast(
  rawTAF: string,
  options: IMetarTAFParserOptionsDated
): IForecastContainer {
  const taf = parseTAF(rawTAF, options);

  return getForecastFromTAF(taf as ITAFDated);
}

interface Parser<T> {
  new (lang: Locale): {
    parse(report: string): T;
  };
}

function parse<T, TDated>(
  rawReport: string,
  options: IMetarTAFParserOptions | IMetarTAFParserOptionsDated | undefined,
  parser: Parser<T>,
  datesHydrator: (report: T, date: Date) => TDated
): T | TDated {
  const locale = options?.locale || en;

  try {
    const report = new parser(locale).parse(rawReport);

    if (options && "date" in options) {
      return datesHydrator(report, options.date);
    }

    return report;
  } catch (e) {
    if (e instanceof ParseError) throw e;

    throw new InvalidWeatherStatementError(e);
  }
}
