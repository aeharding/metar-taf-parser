import { IMetar, ITAF, TAFTrend } from "model/model";
import { IcingCommand } from "./taf/IcingCommand";
import { TurbulenceCommand } from "./taf/TurbulenceCommand";

export interface ICommand {
  canParse(str: string): boolean;
  execute(container: ITAF | TAFTrend, str: string): void;
}

export class CommandSupplier {
  #commands = [new TurbulenceCommand(), new IcingCommand()];

  get(input: string): ICommand | undefined {
    for (const command of this.#commands) {
      if (command.canParse(input)) return command;
    }
  }
}
