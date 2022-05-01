import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";
import { convertFractionalAmount } from "../../commons/converter";

export interface IHailSizeRemark extends IBaseRemark {
  type: RemarkType.HailSize;

  size: number;
}

export class HailSizeCommand extends Command {
  #regex = /^GR ((\d\/\d)|((\d) ?(\d\/\d)?))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(_("Remark.Hail.0", this.locale), matches[1]);

    remark.push({
      type: RemarkType.HailSize,
      description,
      raw: matches[0],

      size: convertFractionalAmount(matches[1]),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
