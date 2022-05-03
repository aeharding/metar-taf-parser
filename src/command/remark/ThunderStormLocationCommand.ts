import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { Direction } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IThunderStormLocationRemark extends IBaseRemark {
  type: RemarkType.ThunderStormLocation;
  location: Direction;
}

export class ThunderStormLocationCommand extends Command {
  #regex = /^TS ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const location = as(matches[1], Direction);

    const description = format(
      _("Remark.Thunderstorm.Location.0", this.locale),
      _(`Converter.${location}`, this.locale)
    );

    remark.push({
      type: RemarkType.ThunderStormLocation,
      description,
      raw: matches[0],

      location,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
