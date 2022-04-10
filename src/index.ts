import { IMetar } from "model/model";
import { MetarParser } from "parser/parser";
import { ParseError, InvalidWeatherStatementError } from "commons/errors";
import { Locale } from "commons/i18n";
import en from "locale/en";

export interface IMetarTAFParserOptions {
  locale?: Locale;
}

export function parseMetar(
  metar: string,
  options?: IMetarTAFParserOptions
): IMetar {
  const lang = options?.locale || en;

  try {
    return new MetarParser(lang).parse(metar);
  } catch (e) {
    if (e instanceof ParseError) throw e;

    throw new InvalidWeatherStatementError(e);
  }
}

export { Locale } from "commons/i18n";
export * from "commons/errors";
export * from "model/model";
export * from "model/enum";
