import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";
import { convertFractionalAmount } from "../../commons/converter";

export interface ISecondLocationVisibilityRemark extends IBaseRemark {
  type: RemarkType.SecondLocationVisibility;
  distance: number;
  location: string;
}

export class SecondLocationVisibilityCommand extends Command {
  #regex = /^VIS ((\d)*( )?(\d?\/?\d)) (\w+)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const distance = matches[1];
    const location = matches[5];
    const description = format(
      _("Remark.Second.Location.Visibility", this.locale),
      distance,
      location
    );

    remark.push({
      type: RemarkType.SecondLocationVisibility,
      description,
      raw: matches[0],

      distance: convertFractionalAmount(distance),
      location,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
