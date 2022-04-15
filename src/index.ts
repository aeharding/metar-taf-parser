import { IMetar, ITAF } from "model/model";
import { MetarParser, TAFParser } from "parser/parser";
import { ParseError, InvalidWeatherStatementError } from "commons/errors";
import { Locale } from "commons/i18n";
import en from "locale/en";

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

export interface IMetarTAFParserOptions {
  locale?: Locale;
}

export function parseMetar(
  metar: string,
  options?: IMetarTAFParserOptions
): IMetar {
  return parse<IMetar>(metar, options, MetarParser);
}

export function parseTAF(taf: string, options?: IMetarTAFParserOptions): ITAF {
  return parse<ITAF>(taf, options, TAFParser);
}

interface Parser<T> {
  new (lang: Locale): {
    parse(report: string): T;
  };
}

function parse<T>(
  report: string,
  options: IMetarTAFParserOptions | undefined,
  parser: Parser<T>
): T {
  const lang = options?.locale || en;

  try {
    return new parser(lang).parse(report);
  } catch (e) {
    if (e instanceof ParseError) throw e;

    throw new InvalidWeatherStatementError(e);
  }
}
