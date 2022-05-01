import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";
import { convertFractionalAmount } from "../../commons/converter";

export interface ISurfaceVisibilityRemark extends IBaseRemark {
  type: RemarkType.SurfaceVisibility;
  distance: number;
}

export class SurfaceVisibilityCommand extends Command {
  #regex = /^SFC VIS ((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const distance = matches[1];
    const description = format(
      _("Remark.Surface.Visibility", this.locale),
      distance
    );

    remark.push({
      type: RemarkType.SurfaceVisibility,
      description,
      raw: matches[0],

      distance: convertFractionalAmount(distance),
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
