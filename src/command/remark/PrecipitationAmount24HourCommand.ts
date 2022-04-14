import { convertPrecipitationAmount } from "commons/converter";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IPrecipitationAmount24HourRemark extends IBaseRemark {
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
