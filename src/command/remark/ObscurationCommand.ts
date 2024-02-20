import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { CloudQuantity, Phenomenon } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IObscurationRemark extends IBaseRemark {
  type: RemarkType.Obscuration;

  quantity: CloudQuantity;
  height: number;
  phenomenon: Phenomenon;
}

export class ObscurationCommand extends Command {
  #regex = /^([A-Z]{2}) ([A-Z]{3})(\d{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const quantity = as(matches[2], CloudQuantity);

    const height = 100 * +matches[3];

    const phenomenon = as(matches[1], Phenomenon);

    const description = format(
      _("Remark.Obscuration", this.locale),
      _(`CloudQuantity.${quantity}`, this.locale),
      height,
      _(`Phenomenon.${phenomenon}`, this.locale),
    );

    remark.push({
      type: RemarkType.Obscuration,
      description,
      raw: matches[0],

      quantity,
      height,
      phenomenon,
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
