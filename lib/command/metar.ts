import * as converter from "commons/converter";
import { UnexpectedParseError } from "commons/errors";
import { findAll } from "helpers/helpers";
import { IMetar } from "model/model";

interface ICommand {
  canParse(str: string): boolean;
  execute(metar: IMetar, str: string): void;
}

export class AltimeterCommand implements ICommand {
  #regex = /^Q(\d{4})$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(metar: IMetar, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    metar.altimeter = +matches[1];
  }
}

export class AltimeterMercuryCommand implements ICommand {
  #regex = /^A(\d{4})$/;

  canParse(input: string): boolean {
    return this.#regex.test(input);
  }

  execute(metar: IMetar, input: string) {
    const matches = input.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const mercury = +matches[1] / 100;

    metar.altimeter = converter.convertInchesMercuryToPascal(mercury);
  }
}

export class RunwayCommand implements ICommand {
  #genericRegex = /^(R\d{2}\w?\/)/;
  #runwayMaxRangeRegex = /^R(\d{2}\w?)\/(\d{4})V(\d{3})(\w{0,2})/;
  #runwayRegex = /^R(\d{2}\w?)\/(\w)?(\d{4})(\w{0,2})$/;

  canParse(input: string): boolean {
    return this.#genericRegex.test(input);
  }

  execute(metar: IMetar, input: string) {
    const matches = input.match(this.#runwayRegex);
    // TODO idk if this matches super well...

    if (matches) {
      metar.runwaysInfo.push({
        name: matches[1],
        minRange: +matches[3],
        trend: matches[4],
      });
    }

    const maxRangeMatches = input.match(this.#runwayMaxRangeRegex);

    if (maxRangeMatches) {
      metar.runwaysInfo.push({
        name: maxRangeMatches[1],
        minRange: +maxRangeMatches[2],
        maxRange: +maxRangeMatches[3],
        trend: maxRangeMatches[4],
      });
    }
  }
}

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
