import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IHourlyPressureRemark extends IBaseRemark {
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
