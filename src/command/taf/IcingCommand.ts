import { UnexpectedParseError } from "commons/errors";
import { ITafGroups } from "model/model";
import { as } from "helpers/helpers";
import { IcingIntensity } from "model/enum";
import { ICommand } from "../taf";

export class IcingCommand implements ICommand {
  #regex = /^6(\d)(\d{3})(\d)$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(container: ITafGroups, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    if (!container.icing) container.icing = [];

    container.icing.push({
      intensity: as(matches[1], IcingIntensity),
      baseHeight: +matches[2] * 100,
      depth: +matches[3] * 1000,
    });
  }
}
