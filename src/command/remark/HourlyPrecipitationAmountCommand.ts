import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IHourlyPrecipitationAmountRemark extends IBaseRemark {
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
      amount,
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
