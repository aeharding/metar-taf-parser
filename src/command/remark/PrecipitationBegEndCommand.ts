import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { Descriptive, Phenomenon } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IPrecipitationBegEndRemark extends IBaseRemark {
  type: RemarkType.PrecipitationBegEnd;
  descriptive?: Descriptive;
  phenomenon: Phenomenon;
  startHour?: number;
  startMin: number;
  endHour?: number;
  endMin: number;
}

export class PrecipitationBegEndCommand extends Command {
  #regex = /^(([A-Z]{2})?([A-Z]{2})B(\d{2})?(\d{2})E(\d{2})?(\d{2}))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const descriptive = matches[2] ? as(matches[2], Descriptive) : undefined;
    const phenomenon = as(matches[3], Phenomenon);

    const description = format(
      _("Remark.Precipitation.Beg.End", this.locale),
      descriptive ? _(`Descriptive.${descriptive}`, this.locale) : "",
      _(`Phenomenon.${phenomenon}`, this.locale),
      matches[4] || "",
      matches[5],
      matches[6] || "",
      matches[7]
    );

    remark.push({
      type: RemarkType.PrecipitationBegEnd,
      description,
      raw: matches[0],

      descriptive,
      phenomenon,
      startHour: matches[4] ? +matches[4] : undefined,
      startMin: +matches[5],
      endHour: matches[6] ? +matches[6] : undefined,
      endMin: +matches[7],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
