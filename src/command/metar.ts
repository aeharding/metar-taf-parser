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
    for (let i = 0; i < this.#commands.length; i++) {
      const command = this.#commands[i];

      if (command.canParse(input)) return command;
    }
  }
}
