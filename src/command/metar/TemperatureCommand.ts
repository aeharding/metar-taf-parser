import * as converter from "../../commons/converter";
import { UnexpectedParseError } from "../../commons/errors";
import { IMetar } from "../../model/model";
import { ICommand } from "../metar";

export class TemperatureCommand implements ICommand {
  #regex = /^(M?\d{2})\/(M?\d{2})$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(metar: IMetar, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    metar.temperature = converter.convertTemperature(matches[1]);
    metar.dewPoint = converter.convertTemperature(matches[2]);
  }
}
