import * as converter from "../../commons/converter";
import { UnexpectedParseError } from "../../commons/errors";
import { IMetar } from "../../model/model";
import { ICommand } from "../metar";

export class AltimeterMercuryCommand implements ICommand {
  #regex = /^A(\d{4})$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(metar: IMetar, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const mercury = +matches[1] / 100;

    metar.altimeter = Math.trunc(
      converter.convertInchesMercuryToPascal(mercury)
    );
  }
}
