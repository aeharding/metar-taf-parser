import { convertTemperatureRemarks } from "../../commons/converter";
import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IHourlyMaximumMinimumTemperatureRemark extends IBaseRemark {
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
