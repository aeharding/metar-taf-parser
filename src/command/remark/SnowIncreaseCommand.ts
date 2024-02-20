import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ISnowIncreaseRemark extends IBaseRemark {
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
      totalDepth,
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
