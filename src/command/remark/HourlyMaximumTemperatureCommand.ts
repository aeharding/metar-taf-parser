import { convertTemperatureRemarks } from "commons/converter";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IHourlyMaximumTemperatureRemark extends IBaseRemark {
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
      convertTemperatureRemarks(matches[1], matches[2]).toFixed(1),
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
