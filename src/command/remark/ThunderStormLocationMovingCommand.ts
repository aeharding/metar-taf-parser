import { as } from "../../helpers/helpers";
import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { Direction } from "../../model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IThunderStormLocationMovingRemark extends IBaseRemark {
  type: RemarkType.ThunderStormLocationMoving;

  /**
   * Current location is relative of the station
   */
  location: Direction;

  /**
   * Direction moving (eg. "SW")
   */
  moving: Direction;
}

export class ThunderStormLocationMovingCommand extends Command {
  #regex = /^TS ([A-Z]{2}) MOV ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const location = as(matches[1], Direction);
    const moving = as(matches[2], Direction);

    const description = format(
      _("Remark.Thunderstorm.Location.Moving", this.locale),
      _(`Converter.${location}`, this.locale),
      _(`Converter.${moving}`, this.locale)
    );

    remark.push({
      type: RemarkType.ThunderStormLocationMoving,
      description,
      raw: matches[0],

      location,
      moving,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
