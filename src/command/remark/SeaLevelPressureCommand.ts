import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ISeaLevelPressureRemark extends IBaseRemark {
  type: RemarkType.SeaLevelPressure;
  pressure: number;
}

export class SeaLevelPressureCommand extends Command {
  #regex = /^SLP(\d{2})(\d)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    let pressure = matches[1].startsWith("9") ? "9" : "10";
    pressure += matches[1] + "." + matches[2];

    const description = format(
      _("Remark.Sea.Level.Pressure", this.locale),
      pressure
    );

    remark.push({
      type: RemarkType.SeaLevelPressure,
      description,
      raw: matches[0],

      pressure: +pressure,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
