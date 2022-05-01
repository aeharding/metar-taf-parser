import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ICeilingHeightRemark extends IBaseRemark {
  type: RemarkType.CeilingHeight;

  /**
   * Ceiling min height (varying between min and max) above ground level
   */
  min: number;

  /**
   * Ceiling max height (varying between min and max) above ground level
   */
  max: number;
}

export class CeilingHeightCommand extends Command {
  #regex = /^CIG (\d{3})V(\d{3})\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const min = +matches[1] * 100;
    const max = +matches[2] * 100;
    const description = format(
      _("Remark.Ceiling.Height", this.locale),
      min,
      max
    );

    remark.push({
      type: RemarkType.CeilingHeight,
      description,
      raw: matches[0],

      min,
      max,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
