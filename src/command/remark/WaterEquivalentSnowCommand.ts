import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IWaterEquivalentSnowRemark extends IBaseRemark {
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
