import { convertPrecipitationAmount } from "commons/converter";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IPrecipitationAmount36HourRemark extends IBaseRemark {
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
      amount,
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
