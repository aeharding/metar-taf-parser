import { as } from "../../helpers/helpers";
import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { Direction } from "../../model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IVirgaDirectionRemark extends IBaseRemark {
  type: RemarkType.VirgaDirection;
  direction: Direction;
}

export class VirgaDirectionCommand extends Command {
  #regex = /^VIRGA ([A-Z]{2})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const direction = as(matches[1], Direction);

    const description = format(
      _("Remark.Virga.Direction", this.locale),
      _(`Converter.${direction}`, this.locale)
    );

    remark.push({
      type: RemarkType.VirgaDirection,
      description,
      raw: matches[0],

      direction,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
