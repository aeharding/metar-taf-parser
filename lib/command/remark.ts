import { pySplit } from "helpers/helpers";
import {
  convertPrecipitationAmount,
  convertTemperatureRemarks,
} from "commons/converter";
import i18n, { format } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";

export abstract class Command {
  abstract canParse(code: string): boolean;

  abstract execute(code: string, remark: string[]): [string, string[]];
}

export class CeilingHeightCommand extends Command {
  #regex = /^CIG (\d{3})V(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const minCeiling = +matches[1] * 100;
    const maxCeiling = +matches[2] * 100;

    remark.push(format(i18n.Remark.Ceiling.Height, minCeiling, maxCeiling));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class CeilingSecondLocationCommand extends Command {
  #regex = /^CIG (\d{3}) (\w+)\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const height = +matches[1] * 100;

    remark.push(
      format(i18n.Remark.Ceiling.Second.Location, height, matches[2])
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HailSizeCommand extends Command {
  #regex = /^GR ((\d\/\d)|((\d) ?(\d\/\d)?))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Hail[0], matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HourlyMaximumMinimumTemperatureCommand extends Command {
  #regex = /^4([01])(\d{3})([01])(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Hourly.Maximum.Minimum.Temperature,
        convertTemperatureRemarks(matches[1], matches[2]),
        convertTemperatureRemarks(matches[3], matches[4])
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HourlyMaximumTemperatureCommand extends Command {
  #regex = /^1([01])(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Hourly.Maximum.Temperature,
        convertTemperatureRemarks(matches[1], matches[2])
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HourlyMinimumTemperatureCommand extends Command {
  #regex = /^2([01])(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Hourly.Minimum.Temperature,
        convertTemperatureRemarks(matches[1], matches[2])
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HourlyPrecipitationAmountCommand extends Command {
  #regex = /^P(\d{4})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Precipitation.Amount.Hourly, +matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HourlyPressureCommand extends Command {
  #regex = /^5(\d)(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      `${i18n.Remark.Barometer[+matches[1]]} ${format(
        i18n.Remark.Pressure.Tendency,
        +matches[1]
      )}`
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class HourlyTemperatureDewPointCommand extends Command {
  #regex = /^T([01])(\d{3})(([01])(\d{3}))?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    if (!matches[3]) {
      remark.push(
        format(
          i18n.Remark.Hourly.Temperature[0],
          convertTemperatureRemarks(matches[1], matches[2])
        )
      );
    } else {
      remark.push(
        format(
          i18n.Remark.Hourly.Temperature.Dew.Point,
          convertTemperatureRemarks(matches[1], matches[2]),
          convertTemperatureRemarks(matches[4], matches[5])
        )
      );
    }

    return [code.replace(this.#regex, ""), remark];
  }
}

export class IceAccretionCommand extends Command {
  #regex = /^l(\d)(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(i18n.Remark.Ice.Accretion.Amount, +matches[2], +matches[1])
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class ObscurationCommand extends Command {
  #regex = /^([A-Z]{2}) ([A-Z]{3})(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const layer =
      i18n.CloudQuantity[matches[2] as keyof typeof i18n.CloudQuantity];

    const height = 100 * +matches[3];

    const detail = i18n.Phenomenon[matches[1] as keyof typeof i18n.Phenomenon];

    remark.push(format(i18n.Remark.Obscuration, layer, height, detail));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class PrecipitationAmount24HourCommand extends Command {
  #regex = /^7(\d{4})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Precipitation.Amount[24],
        convertPrecipitationAmount(matches[1])
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class PrecipitationAmount36HourCommand extends Command {
  #regex = /^([36])(\d{4})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Precipitation.Amount[3][6],
        matches[1],
        convertPrecipitationAmount(matches[2])
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class PrecipitationBegEndCommand extends Command {
  #regex = /^(([A-Z]{2})?([A-Z]{2})B(\d{2})?(\d{2})E(\d{2})?(\d{2}))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Precipitation.Beg.End,
        matches[2]
          ? i18n.Descriptive[matches[2] as keyof typeof i18n.Descriptive]
          : "",
        i18n.Phenomenon[matches[3] as keyof typeof i18n.Phenomenon],
        matches[4] || "",
        matches[5],
        matches[6] || "",
        matches[7]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class PrevailingVisibilityCommand extends Command {
  #regex = /^VIS ((\d)*( )?(\d?\/?\d))V((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(i18n.Remark.Variable.Prevailing.Visibility, matches[1], matches[5])
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SeaLevelPressureCommand extends Command {
  #regex = /^SLP(\d{2})(\d)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    let pressure = matches[1].startsWith("9") ? "9" : "10";
    pressure += matches[1] + "." + matches[2];

    remark.push(format(i18n.Remark.Sea.Level.Pressure, pressure));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SecondLocationVisibilityCommand extends Command {
  #regex = /^VIS ((\d)*( )?(\d?\/?\d)) (\w+)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(i18n.Remark.Second.Location.Visibility, matches[1], matches[5])
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SectorVisibilityCommand extends Command {
  #regex = /^VIS ([A-Z]{1,2}) ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Sector.Visibility,
        i18n.Converter[matches[1] as keyof typeof i18n.Converter],
        matches[2]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SmallHailSizeCommand extends Command {
  #regex = /^GR LESS THAN ((\d )?(\d\/\d)?)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Hail.LesserThan, matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SnowDepthCommand extends Command {
  #regex = /^4\/(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Snow.Depth, +matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SnowIncreaseCommand extends Command {
  #regex = /^SNINCR (\d+)\/(\d+)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(i18n.Remark.Snow.Increasing.Rapidly, matches[1], matches[2])
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SnowPelletsCommand extends Command {
  #regex = /^GS (LGT|MOD|HVY)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Snow.Pellets,
        i18n.Remark[matches[1] as keyof typeof i18n.Remark]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SunshineDurationCommand extends Command {
  #regex = /^98(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Sunshine.Duration, +matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class SurfaceVisibilityCommand extends Command {
  #regex = /^SFC VIS ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Surface.Visibility, matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class ThunderStormLocationCommand extends Command {
  #regex = /^TS ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Thunderstorm.Location[0],
        i18n.Converter[matches[1] as keyof typeof i18n.Converter]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class ThunderStormLocationMovingCommand extends Command {
  #regex = /^TS ([A-Z]{2}) MOV ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Thunderstorm.Location.Moving,
        i18n.Converter[matches[1] as keyof typeof i18n.Converter],
        i18n.Converter[matches[2] as keyof typeof i18n.Converter]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class TornadicActivityBegCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (B(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Tornadic.Activity.Beginning,
        i18n.Remark[matches[1].replace(" ", "") as keyof typeof i18n.Remark],
        matches[3] || "",
        matches[4],
        matches[6],
        i18n.Converter[matches[7] as keyof typeof i18n.Converter]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class TornadicActivityBegEndCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (B(\d{2})?(\d{2}))(E(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Tornadic.Activity.BegEnd,
        i18n.Remark[matches[1].replace(" ", "") as keyof typeof i18n.Remark],
        matches[3] || "",
        matches[4],
        matches[6] || "",
        matches[7],
        matches[9],
        i18n.Converter[matches[10] as keyof typeof i18n.Converter]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class TornadicActivityEndCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (E(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Tornadic.Activity.Ending,
        i18n.Remark[matches[1].replace(" ", "") as keyof typeof i18n.Remark],
        matches[3] || "",
        matches[4],
        matches[6],
        i18n.Converter[matches[7] as keyof typeof i18n.Converter]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class TowerVisibilityCommand extends Command {
  #regex = /^TWR VIS ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.Tower.Visibility, matches[1]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class VariableSkyCommand extends Command {
  #regex = /^([A-Z]{3}) V ([A-Z]{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Variable.Sky.Condition[0],
        i18n.CloudQuantity[matches[1] as keyof typeof i18n.CloudQuantity],
        i18n.CloudQuantity[matches[2] as keyof typeof i18n.CloudQuantity]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class VariableSkyHeightCommand extends Command {
  #regex = /^([A-Z]{3})(\d{3}) V ([A-Z]{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Variable.Sky.Condition.Height,
        100 * +matches[2],
        i18n.CloudQuantity[matches[1] as keyof typeof i18n.CloudQuantity],
        i18n.CloudQuantity[matches[3] as keyof typeof i18n.CloudQuantity]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class VirgaDirectionCommand extends Command {
  #regex = /^VIRGA ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.Virga.Direction,
        i18n.Converter[matches[1] as keyof typeof i18n.Converter]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class WaterEquivalentSnowCommand extends Command {
  #regex = /^933(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(i18n.Remark.Water.Equivalent.Snow.Ground, +matches[1] / 10)
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class WindPeakCommand extends Command {
  #regex = /^PK WND (\d{3})(\d{2,3})\/(\d{2})?(\d{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(
        i18n.Remark.PeakWind,
        matches[1],
        matches[2],
        matches[3] || "",
        matches[4]
      )
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class WindShiftCommand extends Command {
  #regex = /^WSHFT (\d{2})?(\d{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(format(i18n.Remark.WindShift[0], matches[1] || "", matches[2]));

    return [code.replace(this.#regex, ""), remark];
  }
}

export class WindShiftFropaCommand extends Command {
  #regex = /^WSHFT (\d{2})?(\d{2}) FROPA/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    remark.push(
      format(i18n.Remark.WindShift.FROPA, matches[1] || "", matches[2])
    );

    return [code.replace(this.#regex, ""), remark];
  }
}

export class DefaultCommand extends Command {
  canParse(): boolean {
    return true;
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const rmkSplit = pySplit(code, " ", 1);

    if (i18n.Remark[rmkSplit[0] as keyof typeof i18n.Remark]) {
      remark.push(
        i18n.Remark[rmkSplit[0] as keyof typeof i18n.Remark] as string
      );
    } else {
      remark.push(rmkSplit[0]);
    }

    return [rmkSplit.length === 1 ? "" : rmkSplit[1], remark];
  }
}

export class RemarkCommandSupplier {
  defaultCommand: Command;
  commandList: Command[];

  constructor() {
    this.defaultCommand = new DefaultCommand();
    this.commandList = [
      new WindPeakCommand(),
      new WindShiftFropaCommand(),
      new WindShiftCommand(),
      new TowerVisibilityCommand(),
      new SurfaceVisibilityCommand(),
      new PrevailingVisibilityCommand(),
      new SecondLocationVisibilityCommand(),
      new SectorVisibilityCommand(),
      new TornadicActivityBegEndCommand(),
      new TornadicActivityBegCommand(),
      new TornadicActivityEndCommand(),
      new PrecipitationBegEndCommand(),
      new ThunderStormLocationMovingCommand(),
      new ThunderStormLocationCommand(),
      new SmallHailSizeCommand(),
      new HailSizeCommand(),
      new SnowPelletsCommand(),
      new VirgaDirectionCommand(),
      new CeilingHeightCommand(),
      new ObscurationCommand(),
      new VariableSkyHeightCommand(),
      new VariableSkyCommand(),
      new CeilingSecondLocationCommand(),
      new SeaLevelPressureCommand(),
      new SnowIncreaseCommand(),
      new HourlyMaximumMinimumTemperatureCommand(),
      new HourlyMaximumTemperatureCommand(),
      new HourlyMinimumTemperatureCommand(),
      new HourlyPrecipitationAmountCommand(),
      new HourlyTemperatureDewPointCommand(),
      new HourlyPressureCommand(),
      new IceAccretionCommand(),
      new PrecipitationAmount36HourCommand(),
      new PrecipitationAmount24HourCommand(),
      new SnowDepthCommand(),
      new SunshineDurationCommand(),
      new WaterEquivalentSnowCommand(),
    ];
  }

  get(code: string): Command {
    for (let i = 0; i < this.commandList.length; i++) {
      const command = this.commandList[i];

      if (command.canParse(code)) return command;
    }

    return this.defaultCommand;
  }
}
