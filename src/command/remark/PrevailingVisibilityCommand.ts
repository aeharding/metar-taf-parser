import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IPrevailingVisibilityRemark extends IBaseRemark {
  type: RemarkType.PrevailingVisibility;
  minVisibility: string;
  maxVisibility: string;
}

export class PrevailingVisibilityCommand extends Command {
  #regex = /^VIS ((\d)*( )?(\d?\/?\d))V((\d)*( )?(\d?\/?\d))/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const minVisibility = matches[1];
    const maxVisibility = matches[5];

    const description = format(
      _("Remark.Variable.Prevailing.Visibility", this.locale),
      minVisibility,
      maxVisibility
    );

    remark.push({
      type: RemarkType.PrevailingVisibility,
      description,
      raw: matches[0],

      minVisibility,
      maxVisibility,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
