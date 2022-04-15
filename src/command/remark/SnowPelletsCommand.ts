import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface ISnowPelletsRemark extends IBaseRemark {
  type: RemarkType.SnowPellets;
  amount: "LGT" | "MOD" | "HVY";
}

export class SnowPelletsCommand extends Command {
  #regex = /^GS (LGT|MOD|HVY)/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const description = format(
      _("Remark.Snow.Pellets", this.locale),
      _(`Remark.${matches[1]}` as any, this.locale)
    );

    remark.push({
      type: RemarkType.SnowPellets,
      description,
      raw: matches[0],

      amount: matches[1] as ISnowPelletsRemark["amount"],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
