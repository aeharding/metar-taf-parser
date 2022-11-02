import { UnexpectedParseError } from "commons/errors";
import { ITafGroups } from "model/model";
import { as } from "src/helpers/helpers";
import { TurbulenceIntensity } from "src/index";
import { ICommand } from "../taf";

export class TurbulenceCommand implements ICommand {
  #regex = /^5(\d|X)(\d{3})(\d)$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(container: ITafGroups, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    if (!container.turbulence) container.turbulence = [];

    container.turbulence.push({
      intensity: as(matches[2], TurbulenceIntensity),
      baseHeight: +matches[3] * 100,
      depth: +matches[4] * 1000,
    });
  }
}
