import { IMetar, ITAF } from "model/model";
import { MetarParser, TAFParser } from "parser/parser";
import { ParseError, InvalidWeatherStatementError } from "commons/errors";
import { Locale } from "commons/i18n";
import en from "locale/en";
import { IMetarDated, metarDatesHydrator } from "./dates/metar";
import { ITAFDated, tafDatesHydrator } from "./dates/taf";
import { getForecastFromTAF, IForecastContainer } from "forecast/forecast";

export { Locale } from "commons/i18n";
export * from "commons/errors";
export * from "model/model";
export * from "model/enum";
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
} from "command/remark";
export {
  getCompositeForecastForDate,
  IForecastContainer,
  ICompositeForecast,
  Forecast,
  TimestampOutOfBoundsError,
} from "forecast/forecast";
export { TAFTrendDated, ITAFDated } from "dates/taf";
export { IMetarDated } from "dates/metar";

export interface IMetarTAFParserOptions {
  locale?: Locale;
}

export interface IMetarTAFParserOptionsDated extends IMetarTAFParserOptions {
  /**
   * This date should be the date the report was issued.
   *
   * This date is needed to create actual timestamps since the report only has
   * day of month, hour, and minute (and sometimes not even that).
   */
  issued: Date;
}

export function parseMetar(
  rawMetar: string,
  options?: IMetarTAFParserOptions,
): IMetar;
export function parseMetar(
  rawMetar: string,
  options?: IMetarTAFParserOptionsDated,
): IMetarDated;
export function parseMetar(
  rawMetar: string,
  options?: IMetarTAFParserOptions | IMetarTAFParserOptionsDated,
): IMetar | IMetarDated {
  return parse(rawMetar, options, MetarParser, metarDatesHydrator);
}

export function parseTAF(
  rawTAF: string,
  options?: IMetarTAFParserOptions,
): ITAF;
export function parseTAF(
  rawTAF: string,
  options?: IMetarTAFParserOptionsDated,
): ITAFDated;
export function parseTAF(
  rawTAF: string,
  options?: IMetarTAFParserOptions,
): ITAF | ITAFDated {
  return parse(rawTAF, options, TAFParser, tafDatesHydrator);
}

export function parseTAFAsForecast(
  rawTAF: string,
  options: IMetarTAFParserOptionsDated,
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
  datesHydrator: (report: T, issued: Date) => TDated,
): T | TDated {
  const lang = options?.locale || en;

  try {
    const report = new parser(lang).parse(rawReport);

    if (options && "issued" in options && options.issued) {
      return datesHydrator(report, options.issued);
    }

    return report;
  } catch (e) {
    if (e instanceof ParseError) throw e;

    throw new InvalidWeatherStatementError(e);
  }
}
