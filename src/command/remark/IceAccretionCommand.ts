import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IIceAccretionRemark extends IBaseRemark {
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
