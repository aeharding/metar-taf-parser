import { IMetar } from "model/model";
import { MetarParser } from "parser/parser";
import { ParseError, InvalidWeatherStatementError } from "commons/errors";

export function parseMetar(metar: string): IMetar {
  try {
    return new MetarParser().parse(metar);
  } catch (e) {
    if (e instanceof ParseError) throw e;

    throw new InvalidWeatherStatementError(e);
  }
}

export * from "commons/errors";
export * from "model/model";
export * from "model/enum";
