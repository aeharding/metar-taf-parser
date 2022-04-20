import { IMetar } from "model/model";
import { AltimeterCommand } from "./metar/AltimeterCommand";
import { AltimeterMercuryCommand } from "./metar/AltimeterMercuryCommand";
import { RunwayCommand } from "./metar/RunwayCommand";
import { TemperatureCommand } from "./metar/TemperatureCommand";

export interface ICommand {
  canParse(str: string): boolean;
  execute(metar: IMetar, str: string): void;
}

export class CommandSupplier {
  #commands = [
    new RunwayCommand(),
    new TemperatureCommand(),
    new AltimeterCommand(),
    new AltimeterMercuryCommand(),
  ];

  get(input: string): ICommand | undefined {
    for (const command of this.#commands) {
      if (command.canParse(input)) return command;
    }
  }
}
