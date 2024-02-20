import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IWindPeakCommandRemark extends IBaseRemark {
  type: RemarkType.WindPeak;
  /**
   * In knots
   */
  speed: number;
  degrees: number;
  startHour?: number;
  startMinute: number;
}

export class WindPeakCommand extends Command {
  #regex = /^PK WND (\d{3})(\d{2,3})\/(\d{2})?(\d{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const degrees = +matches[1];
    const speed = +matches[2];

    const description = format(
      _("Remark.PeakWind", this.locale),
      degrees,
      speed,
      matches[3] || "",
      matches[4],
    );

    remark.push({
      type: RemarkType.WindPeak,
      description,
      raw: matches[0],

      speed,
      degrees,
      startHour: matches[3] ? +matches[3] : undefined,
      startMinute: +matches[4],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
