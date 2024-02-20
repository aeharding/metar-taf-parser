import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ISunshineDurationRemark extends IBaseRemark {
  type: RemarkType.SunshineDuration;
  duration: number;
}

export class SunshineDurationCommand extends Command {
  #regex = /^98(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const duration = +matches[1];
    const description = format(
      _("Remark.Sunshine.Duration", this.locale),
      duration,
    );

    remark.push({
      type: RemarkType.SunshineDuration,
      description,
      raw: matches[0],

      duration,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
