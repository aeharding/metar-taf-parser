import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";
import { convertFractionalAmount } from "commons/converter";

export interface ITowerVisibilityRemark extends IBaseRemark {
  type: RemarkType.TowerVisibility;
  distance: number;
}

export class TowerVisibilityCommand extends Command {
  #regex = /^TWR VIS ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const distance = matches[1];
    const description = format(
      _("Remark.Tower.Visibility", this.locale),
      distance,
    );

    remark.push({
      type: RemarkType.TowerVisibility,
      description,
      raw: matches[0],

      distance: convertFractionalAmount(distance),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
