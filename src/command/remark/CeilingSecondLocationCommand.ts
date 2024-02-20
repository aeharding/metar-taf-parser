import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ICeilingSecondLocationRemark extends IBaseRemark {
  type: RemarkType.CeilingSecondLocation;

  height: number;
  location: string;
}

export class CeilingSecondLocationCommand extends Command {
  #regex = /^CIG (\d{3}) (\w+)\b/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const height = +matches[1] * 100;
    const location = matches[2];
    const description = format(
      _("Remark.Ceiling.Second.Location", this.locale),
      height,
      location,
    );

    remark.push({
      type: RemarkType.CeilingSecondLocation,
      description,
      raw: matches[0],

      height,
      location,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
