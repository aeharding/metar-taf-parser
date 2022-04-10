import { pySplit } from "helpers/helpers";
import {
  convertPrecipitationAmount,
  convertTemperatureRemarks,
} from "commons/converter";
import { format, _, Locale } from "commons/i18n";
import { TranslationError, UnexpectedParseError } from "commons/errors";

export abstract class Command {
  constructor(protected locale: Locale) {}

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

    remark.push(
      format(_("Remark.Ceiling.Height", this.locale), minCeiling, maxCeiling)
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.Ceiling.Second.Location", this.locale),
        height,
        matches[2]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(format(_("Remark.Hail.0", this.locale), matches[1]));

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Hourly.Maximum.Minimum.Temperature", this.locale),
        convertTemperatureRemarks(matches[1], matches[2]),
        convertTemperatureRemarks(matches[3], matches[4])
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Hourly.Maximum.Temperature", this.locale),
        convertTemperatureRemarks(matches[1], matches[2])
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Hourly.Minimum.Temperature", this.locale),
        convertTemperatureRemarks(matches[1], matches[2])
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(
      format(_("Remark.Precipitation.Amount.Hourly", this.locale), +matches[1])
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
      `${_(`Remark.Barometer.${+matches[1]}` as any, this.locale)} ${format(
        _("Remark.Pressure.Tendency", this.locale),
        +matches[2] / 10
      )}`
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
          _("Remark.Hourly.Temperature.0", this.locale),
          convertTemperatureRemarks(matches[1], matches[2])
        )
      );
    } else {
      remark.push(
        format(
          _("Remark.Hourly.Temperature.Dew.Point", this.locale),
          convertTemperatureRemarks(matches[1], matches[2]),
          convertTemperatureRemarks(matches[4], matches[5])
        )
      );
    }

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.Ice.Accretion.Amount", this.locale),
        +matches[2],
        +matches[1]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    const layer = _(`CloudQuantity.${matches[2]}` as any, this.locale);

    const height = 100 * +matches[3];

    const detail = _(`Phenomenon.${matches[1]}` as any, this.locale);

    remark.push(
      format(_("Remark.Obscuration", this.locale), layer, height, detail)
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Precipitation.Amount.24", this.locale),
        convertPrecipitationAmount(matches[1])
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Precipitation.Amount.3.6", this.locale),
        matches[1],
        convertPrecipitationAmount(matches[2])
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Precipitation.Beg.End", this.locale),
        matches[2] ? _(`Descriptive.${matches[2]}` as any, this.locale) : "",
        _(`Phenomenon.${matches[3]}` as any, this.locale),
        matches[4] || "",
        matches[5],
        matches[6] || "",
        matches[7]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.Variable.Prevailing.Visibility", this.locale),
        matches[1],
        matches[5]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(format(_("Remark.Sea.Level.Pressure", this.locale), pressure));

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.Second.Location.Visibility", this.locale),
        matches[1],
        matches[5]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Sector.Visibility", this.locale),
        _(`Converter.${matches[1]}` as any, this.locale),
        matches[2]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(format(_("Remark.Hail.LesserThan", this.locale), matches[1]));

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(format(_("Remark.Snow.Depth", this.locale), +matches[1]));

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.Snow.Increasing.Rapidly", this.locale),
        matches[1],
        matches[2]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Snow.Pellets", this.locale),
        _(`Remark.${matches[1]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(
      format(_("Remark.Sunshine.Duration", this.locale), +matches[1])
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(
      format(_("Remark.Surface.Visibility", this.locale), matches[1])
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Thunderstorm.Location.0", this.locale),
        _(`Converter.${matches[1]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Thunderstorm.Location.Moving", this.locale),
        _(`Converter.${matches[1]}` as any, this.locale),
        _(`Converter.${matches[2]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Tornadic.Activity.Beginning", this.locale),
        _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
        matches[3] || "",
        matches[4],
        matches[6],
        _(`Converter.${matches[7]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Tornadic.Activity.BegEnd", this.locale),
        _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
        matches[3] || "",
        matches[4],
        matches[6] || "",
        matches[7],
        matches[9],
        _(`Converter.${matches[10]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Tornadic.Activity.Ending", this.locale),
        _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
        matches[3] || "",
        matches[4],
        matches[6],
        _(`Converter.${matches[7]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(format(_("Remark.Tower.Visibility", this.locale), matches[1]));

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Variable.Sky.Condition.0", this.locale),
        _(`CloudQuantity.${matches[1]}` as any, this.locale),
        _(`CloudQuantity.${matches[2]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Variable.Sky.Condition.Height", this.locale),
        100 * +matches[2],
        _(`CloudQuantity.${matches[1]}` as any, this.locale),
        _(`CloudQuantity.${matches[3]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.Virga.Direction", this.locale),
        _(`Converter.${matches[1]}` as any, this.locale)
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.Water.Equivalent.Snow.Ground", this.locale),
        +matches[1] / 10
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
        _("Remark.PeakWind", this.locale),
        matches[1],
        matches[2],
        matches[3] || "",
        matches[4]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
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

    remark.push(
      format(_("Remark.WindShift.0", this.locale), matches[1] || "", matches[2])
    );

    return [code.replace(this.#regex, "").trim(), remark];
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
      format(
        _("Remark.WindShift.FROPA", this.locale),
        matches[1] || "",
        matches[2]
      )
    );

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

export class DefaultCommand extends Command {
  canParse(): boolean {
    return true;
  }

  execute(code: string, remark: string[]): [string, string[]] {
    const rmkSplit = pySplit(code, " ", 1);

    try {
      const rem = _(`Remark.${rmkSplit[0]}` as any, this.locale);
      remark.push(rem);
    } catch (error) {
      if (!(error instanceof TranslationError)) throw error;

      remark.push(rmkSplit[0]);
    }

    return [rmkSplit.length === 1 ? "" : rmkSplit[1], remark];
  }
}

export class RemarkCommandSupplier {
  defaultCommand: Command;
  commandList: Command[];

  constructor(private locale: Locale) {
    this.defaultCommand = new DefaultCommand(locale);
    this.commandList = [
      new WindPeakCommand(locale),
      new WindShiftFropaCommand(locale),
      new WindShiftCommand(locale),
      new TowerVisibilityCommand(locale),
      new SurfaceVisibilityCommand(locale),
      new PrevailingVisibilityCommand(locale),
      new SecondLocationVisibilityCommand(locale),
      new SectorVisibilityCommand(locale),
      new TornadicActivityBegEndCommand(locale),
      new TornadicActivityBegCommand(locale),
      new TornadicActivityEndCommand(locale),
      new PrecipitationBegEndCommand(locale),
      new ThunderStormLocationMovingCommand(locale),
      new ThunderStormLocationCommand(locale),
      new SmallHailSizeCommand(locale),
      new HailSizeCommand(locale),
      new SnowPelletsCommand(locale),
      new VirgaDirectionCommand(locale),
      new CeilingHeightCommand(locale),
      new ObscurationCommand(locale),
      new VariableSkyHeightCommand(locale),
      new VariableSkyCommand(locale),
      new CeilingSecondLocationCommand(locale),
      new SeaLevelPressureCommand(locale),
      new SnowIncreaseCommand(locale),
      new HourlyMaximumMinimumTemperatureCommand(locale),
      new HourlyMaximumTemperatureCommand(locale),
      new HourlyMinimumTemperatureCommand(locale),
      new HourlyPrecipitationAmountCommand(locale),
      new HourlyTemperatureDewPointCommand(locale),
      new HourlyPressureCommand(locale),
      new IceAccretionCommand(locale),
      new PrecipitationAmount36HourCommand(locale),
      new PrecipitationAmount24HourCommand(locale),
      new SnowDepthCommand(locale),
      new SunshineDurationCommand(locale),
      new WaterEquivalentSnowCommand(locale),
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
