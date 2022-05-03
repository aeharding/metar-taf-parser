import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { Descriptive, Phenomenon } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IPrecipitationEndRemark extends IBaseRemark {
  type: RemarkType.PrecipitationEnd;
  descriptive?: Descriptive;
  phenomenon: Phenomenon;
  endHour?: number;
  endMin: number;
}

export class PrecipitationEndCommand extends Command {
  #regex = /^(([A-Z]{2})?([A-Z]{2})E(\d{2})?(\d{2}))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const descriptive = matches[2] ? as(matches[2], Descriptive) : undefined;
    const phenomenon = as(matches[3], Phenomenon);

    const description = format(
      _("Remark.Precipitation.End", this.locale),
      descriptive ? _(`Descriptive.${descriptive}`, this.locale) : "",
      _(`Phenomenon.${phenomenon}`, this.locale),
      matches[4] || "",
      matches[5]
    )?.trim();

    remark.push({
      type: RemarkType.PrecipitationEnd,
      description,
      raw: matches[0],
      descriptive,
      phenomenon,
      endHour: matches[4] ? +matches[4] : undefined,
      endMin: +matches[5],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
