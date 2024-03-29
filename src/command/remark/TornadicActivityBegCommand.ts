import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { Direction } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ITornadicActivityBegRemark extends IBaseRemark {
  type: RemarkType.TornadicActivityBeg;

  tornadicType: "TORNADO" | "FUNNEL CLOUD" | "WATERSPOUT";
  startHour?: number;
  startMinute: number;
  distance: number;
  direction: Direction;
}

export class TornadicActivityBegCommand extends Command {
  #regex =
    /^(TORNADO|FUNNEL CLOUD|WATERSPOUT) (B(\d{2})?(\d{2}))( (\d+)? ([A-Z]{1,2})?)?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[7], Direction);

    const description = format(
      _("Remark.Tornadic.Activity.Beginning", this.locale),
      _(`Remark.${matches[1].replace(" ", "")}` as any, this.locale),
      matches[3] || "",
      matches[4],
      matches[6],
      _(`Converter.${direction}`, this.locale),
    );

    remark.push({
      type: RemarkType.TornadicActivityBeg,
      description,
      raw: matches[0],

      tornadicType: matches[1] as ITornadicActivityBegRemark["tornadicType"],
      startHour: matches[3] ? +matches[3] : undefined,
      startMinute: +matches[4],
      distance: +matches[6],
      direction,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
