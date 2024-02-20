import { convertTemperatureRemarks } from "commons/converter";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IHourlyMinimumTemperatureRemark extends IBaseRemark {
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
      convertTemperatureRemarks(matches[1], matches[2]).toFixed(1),
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
