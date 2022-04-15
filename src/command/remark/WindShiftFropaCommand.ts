import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IWindShiftFropaRemark extends IBaseRemark {
  type: RemarkType.WindShiftFropa;
  startHour?: number;
  startMinute: number;
}

export class WindShiftFropaCommand extends Command {
  #regex = /^WSHFT (\d{2})?(\d{2}) FROPA/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.WindShift.FROPA", this.locale),
      matches[1] || "",
      matches[2]
    );

    remark.push({
      type: RemarkType.WindShiftFropa,
      description,
      raw: matches[0],

      startHour: matches[1] ? +matches[1] : undefined,
      startMinute: +matches[2],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
