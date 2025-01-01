import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface INextForecastByRemark extends IBaseRemark {
  type: RemarkType.NextForecastBy;

  day: number;
  hour: number;
  minute: number;
}

export interface INextForecastByRemarkDated extends INextForecastByRemark {
  type: RemarkType.NextForecastBy;

  date: Date,
}

export class NextForecastByCommand extends Command {
  #regex = /^NXT FCST BY (\d{2})(\d{2})(\d{2})Z/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const day = +matches[1];
    const hour = matches[2];
    const minute = matches[3];

    const description = format(
      _("Remark.Next.Forecast.By", this.locale),
      day,
      hour,
      minute,
    );

    remark.push({
      type: RemarkType.NextForecastBy,
      description,
      raw: matches[0],

      day,
      hour: +hour,
      minute: +minute,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
