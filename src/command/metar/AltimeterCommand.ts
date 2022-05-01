import { UnexpectedParseError } from "../../commons/errors";
import { IMetar } from "../../model/model";
import { ICommand } from "../metar";

export class AltimeterCommand implements ICommand {
  #regex = /^Q(\d{4})$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(metar: IMetar, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    metar.altimeter = Math.trunc(+matches[1]);
  }
}
