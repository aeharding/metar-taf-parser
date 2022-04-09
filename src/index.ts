import { IMetar } from "model/model";
import { MetarParser } from "parser/parser";

export function parseMetar(metar: string): IMetar {
  return new MetarParser().parse(metar);
}

export * from "model/model";
export * from "model/enum";
