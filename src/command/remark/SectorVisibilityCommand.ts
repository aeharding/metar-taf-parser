import { as } from "../../helpers/helpers";
import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { Direction } from "../../model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";
import { convertFractionalAmount } from "../../commons/converter";

export interface ISectorVisibilityRemark extends IBaseRemark {
  type: RemarkType.SectorVisibility;
  direction: Direction;
  distance: number;
}

export class SectorVisibilityCommand extends Command {
  #regex = /^VIS ([A-Z]{1,2}) ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[1], Direction);

    const description = format(
      _("Remark.Sector.Visibility", this.locale),
      _(`Converter.${direction}`, this.locale),
      matches[2]
    );

    remark.push({
      type: RemarkType.SectorVisibility,
      description,
      raw: matches[0],

      direction,
      distance: convertFractionalAmount(matches[2]),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
