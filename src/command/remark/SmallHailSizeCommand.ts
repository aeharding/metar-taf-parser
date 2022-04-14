import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ISmallHailSizeRemark extends IBaseRemark {
  type: RemarkType.SmallHailSize;
  size: string;
}

export class SmallHailSizeCommand extends Command {
  #regex = /^GR LESS THAN ((\d )?(\d\/\d)?)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Hail.LesserThan", this.locale),
      matches[1]
    );

    remark.push({
      type: RemarkType.SmallHailSize,
      description,
      raw: matches[0],

      size: matches[1],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
