import { as, pySplit } from "helpers/helpers";
import {
  convertPrecipitationAmount,
  convertTemperatureRemarks,
} from "commons/converter";
import { format, _, Locale } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { CloudQuantity, Descriptive, Direction, Phenomenon } from "model/enum";

export interface IBaseRemark {
  type: RemarkType;
  description?: string;
  raw: string;
}

export abstract class Command {
  constructor(protected locale: Locale) {}

  abstract canParse(code: string): boolean;

  abstract execute(code: string, remark: Remark[]): [string, Remark[]];
}

interface ICeilingHeightRemark extends IBaseRemark {
  type: RemarkType.CeilingHeight;

  /**
   * Ceiling min height (varying between min and max) above ground level
   */
  min: number;

  /**
   * Ceiling max height (varying between min and max) above ground level
   */
  max: number;
}

export class CeilingHeightCommand extends Command {
  #regex = /^CIG (\d{3})V(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const min = +matches[1] * 100;
    const max = +matches[2] * 100;
    const description = format(
      _("Remark.Ceiling.Height", this.locale),
      min,
      max
    );

    remark.push({
      type: RemarkType.CeilingHeight,
      description,
      raw: matches[0],

      min,
      max,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ICeilingSecondLocationRemark extends IBaseRemark {
  type: RemarkType.CeilingSecondLocation;

  height: number;
  location: string;
}

export class CeilingSecondLocationCommand extends Command {
  #regex = /^CIG (\d{3}) (\w+)\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const height = +matches[1] * 100;
    const location = matches[2];
    const description = format(
      _("Remark.Ceiling.Second.Location", this.locale),
      height,
      location
    );

    remark.push({
      type: RemarkType.CeilingSecondLocation,
      description,
      raw: matches[0],

      height,
      location,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHailSizeRemark extends IBaseRemark {
  type: RemarkType.HailSize;

  size: string;
}

export class HailSizeCommand extends Command {
  #regex = /^GR ((\d\/\d)|((\d) ?(\d\/\d)?))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(_("Remark.Hail.0", this.locale), matches[1]);

    remark.push({
      type: RemarkType.HailSize,
      description,
      raw: matches[0],

      size: matches[1],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHourlyMaximumMinimumTemperatureRemark extends IBaseRemark {
  type: RemarkType.HourlyMaximumMinimumTemperature;

  /**
   * Maximum temperature in C
   */
  max: number;

  /**
   * Minimum temperature in C
   */
  min: number;
}

export class HourlyMaximumMinimumTemperatureCommand extends Command {
  #regex = /^4([01])(\d{3})([01])(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Hourly.Maximum.Minimum.Temperature", this.locale),
      convertTemperatureRemarks(matches[1], matches[2]).toFixed(1),
      convertTemperatureRemarks(matches[3], matches[4]).toFixed(1)
    );

    remark.push({
      type: RemarkType.HourlyMaximumMinimumTemperature,
      description: description,
      raw: matches[0],

      max: convertTemperatureRemarks(matches[1], matches[2]),
      min: convertTemperatureRemarks(matches[3], matches[4]),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHourlyMaximumTemperatureRemark extends IBaseRemark {
  type: RemarkType.HourlyMaximumTemperature;

  /**
   * Maximum temperature in C
   */
  max: number;
}

export class HourlyMaximumTemperatureCommand extends Command {
  #regex = /^1([01])(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Hourly.Maximum.Temperature", this.locale),
      convertTemperatureRemarks(matches[1], matches[2]).toFixed(1)
    );

    remark.push({
      type: RemarkType.HourlyMaximumTemperature,
      description: description,
      raw: matches[0],

      max: convertTemperatureRemarks(matches[1], matches[2]),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHourlyMinimumTemperatureRemark extends IBaseRemark {
  type: RemarkType.HourlyMinimumTemperature;

  /**
   * Minimum temperature in C
   */
  min: number;
}

export class HourlyMinimumTemperatureCommand extends Command {
  #regex = /^2([01])(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Hourly.Minimum.Temperature", this.locale),
      convertTemperatureRemarks(matches[1], matches[2]).toFixed(1)
    );

    remark.push({
      type: RemarkType.HourlyMinimumTemperature,
      description,
      raw: matches[0],

      min: convertTemperatureRemarks(matches[1], matches[2]),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHourlyPrecipitationAmountRemark extends IBaseRemark {
  type: RemarkType.HourlyPrecipitationAmount;

  /**
   * In inches
   */
  amount: number;
}

export class HourlyPrecipitationAmountCommand extends Command {
  #regex = /^P(\d{4})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const amount = +matches[1];
    const description = format(
      _("Remark.Precipitation.Amount.Hourly", this.locale),
      amount
    );

    remark.push({
      type: RemarkType.HourlyPrecipitationAmount,
      description,
      raw: matches[0],

      amount: amount / 100,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHourlyPressureRemark extends IBaseRemark {
  type: RemarkType.HourlyPressure;

  /**
   * https://www.e-education.psu.edu/files/meteo101/image/Section13/metar_decoding1203.html
   *
   * | Code Figure |                                     Description                                    |                        Primary Requirement                        |
   * |:-----------:|:----------------------------------------------------------------------------------:|:-----------------------------------------------------------------:|
   * |      0      | Increasing, then decreasing.                                                       | Atmospheric pressure now higher than 3 hours ago. (x3 rows below) |
   * |      1      | Increasing, then steady, or increasing then increasing more slowly.                |                                                                   |
   * |      2      | Increasing steadily or unsteadily.                                                 |                                                                   |
   * |      3      | Decreasing or steady, then increasing; or increasing then increasing more rapidly. |                                                                   |
   * |      0      | Increasing, then decreasing.                                                       | Atmospheric pressure now same as 3 hours ago. (x3 rows below)     |
   * |      4      | Steady                                                                             |                                                                   |
   * |      5      | Decreasing then increasing.                                                        |                                                                   |
   * |      5      | Decreasing, then increasing.                                                       | Atmospheric pressure now lower than 3 hours ago. (x3 rows below)  |
   * |      6      | Decreasing, then steady, or decreasing then decreasing more slowly.                |                                                                   |
   * |      7      | Decreasing steadily or unsteadily.                                                 |                                                                   |
   * |      8      | Steady or increasing, then decreasing; or decreasing then decreasing more rapidly. |                                                                   |
   */
  code: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  /**
   * In hectopascals
   */
  pressureChange: number;
}

export class HourlyPressureCommand extends Command {
  #regex = /^5(\d)(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const part1 = _(`Remark.Barometer.${+matches[1]}` as any, this.locale);
    const part2 = format(
      _("Remark.Pressure.Tendency", this.locale),
      +matches[2] / 10
    );
    const description =
      part1 != null && part2 != null ? `${part1} ${part2}` : undefined;

    remark.push({
      type: RemarkType.HourlyPressure,
      description,
      raw: matches[0],

      code: +matches[1] as IHourlyPressureRemark["code"],
      pressureChange: +matches[2] / 10,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IHourlyTemperatureDewPointRemark extends IBaseRemark {
  type: RemarkType.HourlyTemperatureDewPoint;

  /**
   * In C
   */
  temperature: number;

  /**
   * In C
   */
  dewPoint?: number;
}

export class HourlyTemperatureDewPointCommand extends Command {
  #regex = /^T([01])(\d{3})(([01])(\d{3}))?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const temperature = convertTemperatureRemarks(matches[1], matches[2]);

    if (!matches[3]) {
      const description = format(
        _("Remark.Hourly.Temperature.0", this.locale),
        temperature.toFixed(1)
      );

      remark.push({
        type: RemarkType.HourlyTemperatureDewPoint,
        description,
        raw: matches[0],

        temperature,
      });
    } else {
      const dewPoint = convertTemperatureRemarks(matches[4], matches[5]);
      const description = format(
        _("Remark.Hourly.Temperature.Dew.Point", this.locale),
        temperature.toFixed(1),
        dewPoint.toFixed(1)
      );

      remark.push({
        type: RemarkType.HourlyTemperatureDewPoint,
        description,
        raw: matches[0],

        temperature,
        dewPoint,
      });
    }

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IIceAccretionRemark extends IBaseRemark {
  type: RemarkType.IceAccretion;

  /**
   * In inches
   */
  amount: number;

  periodInHours: number;
}

export class IceAccretionCommand extends Command {
  #regex = /^l(\d)(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Ice.Accretion.Amount", this.locale),
      +matches[2],
      +matches[1]
    );

    remark.push({
      type: RemarkType.IceAccretion,
      description,
      raw: matches[0],

      amount: +matches[2] / 100,
      periodInHours: +matches[1],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IObscurationRemark extends IBaseRemark {
  type: RemarkType.Obscuration;

  quantity: CloudQuantity;
  height: number;
  phenomenon: Phenomenon;
}

export class ObscurationCommand extends Command {
  #regex = /^([A-Z]{2}) ([A-Z]{3})(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const quantity = as(matches[2], CloudQuantity);

    const height = 100 * +matches[3];

    const phenomenon = as(matches[1], Phenomenon);

    const description = format(
      _("Remark.Obscuration", this.locale),
      _(`CloudQuantity.${quantity}`, this.locale),
      height,
      _(`Phenomenon.${phenomenon}`, this.locale)
    );

    remark.push({
      type: RemarkType.Obscuration,
      description,
      raw: matches[0],

      quantity,
      height,
      phenomenon,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IPrecipitationAmount24HourRemark extends IBaseRemark {
  type: RemarkType.PrecipitationAmount24Hour;

  /**
   * In inches
   */
  amount: number;
}

export class PrecipitationAmount24HourCommand extends Command {
  #regex = /^7(\d{4})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const amount = convertPrecipitationAmount(matches[1]);
    const description = format(
      _("Remark.Precipitation.Amount.24", this.locale),
      amount
    );

    remark.push({
      type: RemarkType.PrecipitationAmount24Hour,
      description,
      raw: matches[0],

      amount,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IPrecipitationAmount36HourRemark extends IBaseRemark {
  type: RemarkType.PrecipitationAmount36Hour;

  periodInHours: 3 | 6;

  /**
   * In inches
   */
  amount: number;
}

export class PrecipitationAmount36HourCommand extends Command {
  #regex = /^([36])(\d{4})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const periodInHours =
      +matches[1] as IPrecipitationAmount36HourRemark["periodInHours"];
    const amount = convertPrecipitationAmount(matches[2]);

    const description = format(
      _("Remark.Precipitation.Amount.3.6", this.locale),
      periodInHours,
      amount
    );

    remark.push({
      type: RemarkType.PrecipitationAmount36Hour,
      description,
      raw: matches[0],

      periodInHours,
      amount,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IPrecipitationBegEndRemark extends IBaseRemark {
  type: RemarkType.PrecipitationBegEnd;
  descriptive?: Descriptive;
  phenomenon: Phenomenon;
  startHour?: number;
  startMin: number;
  endHour?: number;
  endMin: number;
}

export class PrecipitationBegEndCommand extends Command {
  #regex = /^(([A-Z]{2})?([A-Z]{2})B(\d{2})?(\d{2})E(\d{2})?(\d{2}))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const descriptive = matches[2] ? as(matches[2], Descriptive) : undefined;
    const phenomenon = as(matches[3], Phenomenon);

    const description = format(
      _("Remark.Precipitation.Beg.End", this.locale),
      descriptive ? _(`Descriptive.${descriptive}`, this.locale) : "",
      _(`Phenomenon.${phenomenon}`, this.locale),
      matches[4] || "",
      matches[5],
      matches[6] || "",
      matches[7]
    );

    remark.push({
      type: RemarkType.PrecipitationBegEnd,
      description,
      raw: matches[0],

      descriptive,
      phenomenon,
      startHour: matches[4] ? +matches[4] : undefined,
      startMin: +matches[5],
      endHour: matches[6] ? +matches[6] : undefined,
      endMin: +matches[7],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IPrevailingVisibilityRemark extends IBaseRemark {
  type: RemarkType.PrevailingVisibility;
  minVisibility: string;
  maxVisibility: string;
}

export class PrevailingVisibilityCommand extends Command {
  #regex = /^VIS ((\d)*( )?(\d?\/?\d))V((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const minVisibility = matches[1];
    const maxVisibility = matches[5];

    const description = format(
      _("Remark.Variable.Prevailing.Visibility", this.locale),
      minVisibility,
      maxVisibility
    );

    remark.push({
      type: RemarkType.PrevailingVisibility,
      description,
      raw: matches[0],

      minVisibility,
      maxVisibility,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISeaLevelPressureRemark extends IBaseRemark {
  type: RemarkType.SeaLevelPressure;
  pressure: number;
}

export class SeaLevelPressureCommand extends Command {
  #regex = /^SLP(\d{2})(\d)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    let pressure = matches[1].startsWith("9") ? "9" : "10";
    pressure += matches[1] + "." + matches[2];

    const description = format(
      _("Remark.Sea.Level.Pressure", this.locale),
      pressure
    );

    remark.push({
      type: RemarkType.SeaLevelPressure,
      description,
      raw: matches[0],

      pressure: +pressure,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISecondLocationVisibilityRemark extends IBaseRemark {
  type: RemarkType.SecondLocationVisibility;
  distance: string;
  location: string;
}

export class SecondLocationVisibilityCommand extends Command {
  #regex = /^VIS ((\d)*( )?(\d?\/?\d)) (\w+)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const distance = matches[1];
    const location = matches[5];
    const description = format(
      _("Remark.Second.Location.Visibility", this.locale),
      distance,
      location
    );

    remark.push({
      type: RemarkType.SecondLocationVisibility,
      description,
      raw: matches[0],

      distance,
      location,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISectorVisibilityRemark extends IBaseRemark {
  type: RemarkType.SectorVisibility;
  direction: Direction;
  distance: string;
}

export class SectorVisibilityCommand extends Command {
  #regex = /^VIS ([A-Z]{1,2}) ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[1], Direction);

    const description = format(
      _("Remark.Sector.Visibility", this.locale),
      _(`Converter.${direction}`, this.locale),
      matches[2]
    );

    remark.push({
      type: RemarkType.SectorVisibility,
      description,
      raw: matches[0],

      direction,
      distance: matches[2],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISmallHailSizeRemark extends IBaseRemark {
  type: RemarkType.SmallHailSize;
  size: string;
}

export class SmallHailSizeCommand extends Command {
  #regex = /^GR LESS THAN ((\d )?(\d\/\d)?)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Hail.LesserThan", this.locale),
      matches[1]
    );

    remark.push({
      type: RemarkType.SmallHailSize,
      description,
      raw: matches[0],

      size: matches[1],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISnowDepthRemark extends IBaseRemark {
  type: RemarkType.SnowDepth;
  depth: number;
}

export class SnowDepthCommand extends Command {
  #regex = /^4\/(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const depth = +matches[1];
    const description = format(_("Remark.Snow.Depth", this.locale), depth);

    remark.push({
      type: RemarkType.SnowDepth,
      description,
      raw: matches[0],

      depth,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISnowIncreaseRemark extends IBaseRemark {
  type: RemarkType.SnowIncrease;
  inchesLastHour: number;
  totalDepth: number;
}

export class SnowIncreaseCommand extends Command {
  #regex = /^SNINCR (\d+)\/(\d+)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const inchesLastHour = +matches[1];
    const totalDepth = +matches[2];

    const description = format(
      _("Remark.Snow.Increasing.Rapidly", this.locale),
      inchesLastHour,
      totalDepth
    );

    remark.push({
      type: RemarkType.SnowIncrease,
      description,
      raw: matches[0],

      inchesLastHour,
      totalDepth,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISnowPelletsRemark extends IBaseRemark {
  type: RemarkType.SnowPellets;
  amount: "LGT" | "MOD" | "HVY";
}

export class SnowPelletsCommand extends Command {
  #regex = /^GS (LGT|MOD|HVY)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Snow.Pellets", this.locale),
      _(`Remark.${matches[1]}` as any, this.locale)
    );

    remark.push({
      type: RemarkType.SnowPellets,
      description,
      raw: matches[0],

      amount: matches[1] as ISnowPelletsRemark["amount"],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISunshineDurationRemark extends IBaseRemark {
  type: RemarkType.SunshineDuration;
  duration: number;
}

export class SunshineDurationCommand extends Command {
  #regex = /^98(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const duration = +matches[1];
    const description = format(
      _("Remark.Sunshine.Duration", this.locale),
      duration
    );

    remark.push({
      type: RemarkType.SunshineDuration,
      description,
      raw: matches[0],

      duration,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ISurfaceVisibilityRemark extends IBaseRemark {
  type: RemarkType.SurfaceVisibility;
  distance: string;
}

export class SurfaceVisibilityCommand extends Command {
  #regex = /^SFC VIS ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const distance = matches[1];
    const description = format(
      _("Remark.Surface.Visibility", this.locale),
      distance
    );

    remark.push({
      type: RemarkType.SurfaceVisibility,
      description,
      raw: matches[0],

      distance,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IThunderStormLocationRemark extends IBaseRemark {
  type: RemarkType.ThunderStormLocation;
  location: Direction;
}

export class ThunderStormLocationCommand extends Command {
  #regex = /^TS ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const location = as(matches[1], Direction);

    const description = format(
      _("Remark.Thunderstorm.Location.0", this.locale),
      _(`Converter.${location}`, this.locale)
    );

    remark.push({
      type: RemarkType.ThunderStormLocation,
      description,
      raw: matches[0],

      location,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IThunderStormLocationMovingRemark extends IBaseRemark {
  type: RemarkType.ThunderStormLocationMoving;

  /**
   * Current location is relative of the station
   */
  location: Direction;

  /**
   * Direction moving (eg. "SW")
   */
  moving: Direction;
}

export class ThunderStormLocationMovingCommand extends Command {
  #regex = /^TS ([A-Z]{2}) MOV ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const location = as(matches[1], Direction);
    const moving = as(matches[2], Direction);

    const description = format(
      _("Remark.Thunderstorm.Location.Moving", this.locale),
      _(`Converter.${location}`, this.locale),
      _(`Converter.${moving}`, this.locale)
    );

    remark.push({
      type: RemarkType.ThunderStormLocationMoving,
      description,
      raw: matches[0],

      location,
      moving,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ITornadicActivityBegRemark extends IBaseRemark {
  type: RemarkType.TornadicActivityBeg;

  tornadicType: "TORNADO" | "FUNNEL CLOUD" | "WATERSPOUT";
  startHour?: number;
  startMinute: number;
  distance: number;
  direction: Direction;
}

export class TornadicActivityBegCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (B(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[7], Direction);

    const description = format(
      _("Remark.Tornadic.Activity.Beginning", this.locale),
      _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
      matches[3] || "",
      matches[4],
      matches[6],
      _(`Converter.${direction}`, this.locale)
    );

    remark.push({
      type: RemarkType.TornadicActivityBeg,
      description,
      raw: matches[0],

      tornadicType: matches[1] as ITornadicActivityBegRemark["tornadicType"],
      startHour: matches[3] ? +matches[3] : undefined,
      startMinute: +matches[4],
      distance: +matches[6],
      direction,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ITornadicActivityBegEndRemark extends IBaseRemark {
  type: RemarkType.TornadicActivityBegEnd;

  tornadicType: "TORNADO" | "FUNNEL CLOUD" | "WATERSPOUT";
  startHour?: number;
  startMinute: number;
  endHour?: number;
  endMinute: number;
  distance: number;
  direction: Direction;
}

export class TornadicActivityBegEndCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (B(\d{2})?(\d{2}))(E(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[10], Direction);

    const description = format(
      _("Remark.Tornadic.Activity.BegEnd", this.locale),
      _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
      matches[3] || "",
      matches[4],
      matches[6] || "",
      matches[7],
      matches[9],
      _(`Converter.${direction}`, this.locale)
    );

    remark.push({
      type: RemarkType.TornadicActivityBegEnd,
      description,
      raw: matches[0],

      tornadicType: matches[1] as ITornadicActivityBegRemark["tornadicType"],
      startHour: matches[3] ? +matches[3] : undefined,
      startMinute: +matches[4],
      endHour: matches[6] ? +matches[6] : undefined,
      endMinute: +matches[7],
      distance: +matches[9],
      direction,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ITornadicActivityEndRemark extends IBaseRemark {
  type: RemarkType.TornadicActivityEnd;

  tornadicType: "TORNADO" | "FUNNEL CLOUD" | "WATERSPOUT";
  endHour?: number;
  endMinute: number;
  distance: number;
  direction: Direction;
}

export class TornadicActivityEndCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (E(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[7], Direction);

    const description = format(
      _("Remark.Tornadic.Activity.Ending", this.locale),
      _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
      matches[3] || "",
      matches[4],
      matches[6],
      _(`Converter.${direction}`, this.locale)
    );

    remark.push({
      type: RemarkType.TornadicActivityEnd,
      description,
      raw: matches[0],

      tornadicType: matches[1] as ITornadicActivityEndRemark["tornadicType"],
      endHour: matches[3] ? +matches[3] : undefined,
      endMinute: +matches[4],
      distance: +matches[6],
      direction,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface ITowerVisibilityRemark extends IBaseRemark {
  type: RemarkType.TowerVisibility;
  distance: string;
}

export class TowerVisibilityCommand extends Command {
  #regex = /^TWR VIS ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const distance = matches[1];
    const description = format(
      _("Remark.Tower.Visibility", this.locale),
      distance
    );

    remark.push({
      type: RemarkType.TowerVisibility,
      description,
      raw: matches[0],

      distance,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IVariableSkyRemark extends IBaseRemark {
  type: RemarkType.VariableSky;
  cloudQuantityRange: [CloudQuantity, CloudQuantity];
}

export class VariableSkyCommand extends Command {
  #regex = /^([A-Z]{3}) V ([A-Z]{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const firstQuantity = as(matches[1], CloudQuantity);
    const secondQuantity = as(matches[2], CloudQuantity);

    const description = format(
      _("Remark.Variable.Sky.Condition.0", this.locale),
      _(`CloudQuantity.${firstQuantity}`, this.locale),
      _(`CloudQuantity.${secondQuantity}`, this.locale)
    );

    remark.push({
      type: RemarkType.VariableSky,
      description,
      raw: matches[0],

      cloudQuantityRange: [firstQuantity, secondQuantity],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IVariableSkyHeightRemark extends IBaseRemark {
  type: RemarkType.VariableSkyHeight;
  height: number;
  cloudQuantityRange: [CloudQuantity, CloudQuantity];
}

export class VariableSkyHeightCommand extends Command {
  #regex = /^([A-Z]{3})(\d{3}) V ([A-Z]{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const firstQuantity = as(matches[1], CloudQuantity);
    const secondQuantity = as(matches[3], CloudQuantity);

    const height = 100 * +matches[2];
    const description = format(
      _("Remark.Variable.Sky.Condition.Height", this.locale),
      height,
      _(`CloudQuantity.${firstQuantity}`, this.locale),
      _(`CloudQuantity.${secondQuantity}`, this.locale)
    );

    remark.push({
      type: RemarkType.VariableSkyHeight,
      description,
      raw: matches[0],

      height,
      cloudQuantityRange: [firstQuantity, secondQuantity],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IVirgaDirectionRemark extends IBaseRemark {
  type: RemarkType.VirgaDirection;
  direction: Direction;
}

export class VirgaDirectionCommand extends Command {
  #regex = /^VIRGA ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[1], Direction);

    const description = format(
      _("Remark.Virga.Direction", this.locale),
      _(`Converter.${direction}`, this.locale)
    );

    remark.push({
      type: RemarkType.VirgaDirection,
      description,
      raw: matches[0],

      direction,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IWaterEquivalentSnowRemark extends IBaseRemark {
  type: RemarkType.WaterEquivalentSnow;
  amount: number;
}

export class WaterEquivalentSnowCommand extends Command {
  #regex = /^933(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const amount = +matches[1] / 10;
    const description = format(
      _("Remark.Water.Equivalent.Snow.Ground", this.locale),
      amount
    );

    remark.push({
      type: RemarkType.WaterEquivalentSnow,
      description,
      raw: matches[0],

      amount,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IWindPeakCommandRemark extends IBaseRemark {
  type: RemarkType.WindPeak;
  /**
   * In knots
   */
  speed: number;
  degrees: number;
  startHour?: number;
  startMinute: number;
}

export class WindPeakCommand extends Command {
  #regex = /^PK WND (\d{3})(\d{2,3})\/(\d{2})?(\d{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const degrees = +matches[1];
    const speed = +matches[2];

    const description = format(
      _("Remark.PeakWind", this.locale),
      degrees,
      speed,
      matches[3] || "",
      matches[4]
    );

    remark.push({
      type: RemarkType.WindPeak,
      description,
      raw: matches[0],

      speed,
      degrees,
      startHour: matches[3] ? +matches[3] : undefined,
      startMinute: +matches[4],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IWindShiftRemark extends IBaseRemark {
  type: RemarkType.WindShift;
  startHour?: number;
  startMinute: number;
}

export class WindShiftCommand extends Command {
  #regex = /^WSHFT (\d{2})?(\d{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.WindShift.0", this.locale),
      matches[1] || "",
      matches[2]
    );

    remark.push({
      type: RemarkType.WindShift,
      description,
      raw: matches[0],

      startHour: matches[1] ? +matches[1] : undefined,
      startMinute: +matches[2],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IWindShiftFropaRemark extends IBaseRemark {
  type: RemarkType.WindShiftFropa;
  startHour?: number;
  startMinute: number;
}

export class WindShiftFropaCommand extends Command {
  #regex = /^WSHFT (\d{2})?(\d{2}) FROPA/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.WindShift.FROPA", this.locale),
      matches[1] || "",
      matches[2]
    );

    remark.push({
      type: RemarkType.WindShiftFropa,
      description,
      raw: matches[0],

      startHour: matches[1] ? +matches[1] : undefined,
      startMinute: +matches[2],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}

interface IUnknownRemark extends IBaseRemark {
  type: RemarkType.Unknown;
}

type DefaultRemarkTypes =
  | RemarkType.AO1
  | RemarkType.AO2
  | RemarkType.PRESFR
  | RemarkType.PRESRR
  | RemarkType.TORNADO
  | RemarkType.FUNNELCLOUD
  | RemarkType.WATERSPOUT
  | RemarkType.VIRGA;

interface IDefaultCommandRemark extends IBaseRemark {
  type: DefaultRemarkTypes;
}

export class DefaultCommand extends Command {
  canParse(): boolean {
    return true;
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const rmkSplit = pySplit(code, " ", 1);
    const rem = _(`Remark.${rmkSplit[0]}` as any, this.locale);

    if (RemarkType[rmkSplit[0] as RemarkType]) {
      remark.push({
        type: rmkSplit[0] as RemarkType,
        description: rem,
        raw: rmkSplit[0],
      } as IDefaultCommandRemark);
    } else {
      const lastRemark = remark[remark.length - 1];
      if (lastRemark?.type === RemarkType.Unknown) {
        // Merge with last unknown value
        lastRemark.raw = `${lastRemark.raw} ${rmkSplit[0]}`;
      } else {
        remark.push({
          type: RemarkType.Unknown,
          raw: rmkSplit[0],
        });
      }
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

export enum RemarkType {
  // Unknown processed with default command
  Unknown = "Unknown",

  // Processed with default command
  AO1 = "AO1",
  AO2 = "AO2",
  PRESFR = "PRESFR",
  PRESRR = "PRESRR",
  TORNADO = "TORNADO",
  FUNNELCLOUD = "FUNNELCLOUD",
  WATERSPOUT = "WATERSPOUT",
  VIRGA = "VIRGA",

  // Regular commands below
  WindPeak = "WindPeak",
  WindShiftFropa = "WindShiftFropa",
  WindShift = "WindShift",
  TowerVisibility = "TowerVisibility",
  SurfaceVisibility = "SurfaceVisibility",
  PrevailingVisibility = "PrevailingVisibility",
  SecondLocationVisibility = "SecondLocationVisibility",
  SectorVisibility = "SectorVisibility",
  TornadicActivityBegEnd = "TornadicActivityBegEnd",
  TornadicActivityBeg = "TornadicActivityBeg",
  TornadicActivityEnd = "TornadicActivityEnd",
  PrecipitationBegEnd = "PrecipitationBegEnd",
  ThunderStormLocationMoving = "ThunderStormLocationMoving",
  ThunderStormLocation = "ThunderStormLocation",
  SmallHailSize = "SmallHailSize",
  HailSize = "HailSize",
  SnowPellets = "SnowPellets",
  VirgaDirection = "VirgaDirection",
  CeilingHeight = "CeilingHeight",
  Obscuration = "Obscuration",
  VariableSkyHeight = "VariableSkyHeight",
  VariableSky = "VariableSky",
  CeilingSecondLocation = "CeilingSecondLocation",
  SeaLevelPressure = "SeaLevelPressure",
  SnowIncrease = "SnowIncrease",
  HourlyMaximumMinimumTemperature = "HourlyMaximumMinimumTemperature",
  HourlyMaximumTemperature = "HourlyMaximumTemperature",
  HourlyMinimumTemperature = "HourlyMinimumTemperature",
  HourlyPrecipitationAmount = "HourlyPrecipitationAmount",
  HourlyTemperatureDewPoint = "HourlyTemperatureDewPoint",
  HourlyPressure = "HourlyPressure",
  IceAccretion = "IceAccretion",
  PrecipitationAmount36Hour = "PrecipitationAmount36Hour",
  PrecipitationAmount24Hour = "PrecipitationAmount24Hour",
  SnowDepth = "SnowDepth",
  SunshineDuration = "SunshineDuration",
  WaterEquivalentSnow = "WaterEquivalentSnow",
}

export type Remark =
  | IUnknownRemark
  | IDefaultCommandRemark
  // Regular commands below
  | ICeilingHeightRemark
  | ICeilingSecondLocationRemark
  | IHailSizeRemark
  | IHourlyMaximumMinimumTemperatureRemark
  | IHourlyMaximumTemperatureRemark
  | IHourlyMinimumTemperatureRemark
  | IHourlyPrecipitationAmountRemark
  | IHourlyPressureRemark
  | IHourlyTemperatureDewPointRemark
  | IIceAccretionRemark
  | IObscurationRemark
  | IPrecipitationAmount24HourRemark
  | IPrecipitationAmount36HourRemark
  | IPrecipitationAmount36HourRemark
  | IPrecipitationBegEndRemark
  | IPrevailingVisibilityRemark
  | ISeaLevelPressureRemark
  | ISecondLocationVisibilityRemark
  | ISectorVisibilityRemark
  | ISmallHailSizeRemark
  | ISnowDepthRemark
  | ISnowIncreaseRemark
  | ISnowPelletsRemark
  | ISunshineDurationRemark
  | ISurfaceVisibilityRemark
  | IThunderStormLocationRemark
  | IThunderStormLocationMovingRemark
  | ITornadicActivityBegRemark
  | ITornadicActivityBegEndRemark
  | ITornadicActivityEndRemark
  | ITowerVisibilityRemark
  | IVariableSkyRemark
  | IVariableSkyHeightRemark
  | IVirgaDirectionRemark
  | IWaterEquivalentSnowRemark
  | IWindPeakCommandRemark
  | IWindShiftRemark
  | IWindShiftFropaRemark;
