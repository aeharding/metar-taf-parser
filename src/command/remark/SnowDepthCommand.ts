import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ISnowDepthRemark extends IBaseRemark {
  type: RemarkType.SnowDepth;
  depth: number;
}

export class SnowDepthCommand extends Command {
  #regex = /^4\/(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const depth = +matches[1];
    const description = format(_("Remark.Snow.Depth", this.locale), depth);

    remark.push({
      type: RemarkType.SnowDepth,
      description,
      raw: matches[0],

      depth,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
