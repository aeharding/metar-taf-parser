import * as converter from "commons/converter";
import { UnexpectedParseError } from "commons/errors";
import { IMetar } from "model/model";
import { as } from "helpers/helpers";
import { RunwayInfoTrend, RunwayInfoUnit, ValueIndicator } from "model/enum";

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

    metar.altimeter = Math.trunc(+matches[1]);
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

    metar.altimeter = Math.trunc(
      converter.convertInchesMercuryToPascal(mercury)
    );
  }
}

export class RunwayCommand implements ICommand {
  #genericRegex = /^(R\d{2}\w?\/)/;
  #runwayMaxRangeRegex = /^R(\d{2}\w?)\/(\d{4})V(\d{3,4})([UDN])?(FT)?/;
  #runwayRegex = /^R(\d{2}\w?)\/([MP])?(\d{4})([UDN])?(FT)?$/;

  canParse(input: string): boolean {
    return this.#genericRegex.test(input);
  }

  execute(metar: IMetar, input: string) {
    // TODO idk if this matches super well...

    if (this.#runwayRegex.test(input)) {
      const matches = input.match(this.#runwayRegex);

      if (!matches) throw new UnexpectedParseError("Should be able to parse");

      const indicator = matches[2] ? as(matches[2], ValueIndicator) : undefined;
      const trend = matches[4] ? as(matches[4], RunwayInfoTrend) : undefined;
      const unit = matches[5]
        ? as(matches[5], RunwayInfoUnit)
        : RunwayInfoUnit.Meters;

      metar.runwaysInfo.push({
        name: matches[1],
        indicator,
        minRange: +matches[3],
        trend,
        unit,
      });
    } else if (this.#runwayMaxRangeRegex.test(input)) {
      const matches = input.match(this.#runwayMaxRangeRegex);

      if (!matches) throw new UnexpectedParseError("Should be able to parse");

      const trend = matches[4] ? as(matches[4], RunwayInfoTrend) : undefined;
      const unit = matches[5]
        ? as(matches[5], RunwayInfoUnit)
        : RunwayInfoUnit.Meters;

      metar.runwaysInfo.push({
        name: matches[1],
        minRange: +matches[2],
        maxRange: +matches[3],
        trend,
        unit,
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
