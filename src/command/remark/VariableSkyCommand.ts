import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { CloudQuantity } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IVariableSkyRemark extends IBaseRemark {
  type: RemarkType.VariableSky;
  cloudQuantityRange: [CloudQuantity, CloudQuantity];
}

export class VariableSkyCommand extends Command {
  #regex = /^([A-Z]{3}) V ([A-Z]{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const firstQuantity = as(matches[1], CloudQuantity);
    const secondQuantity = as(matches[2], CloudQuantity);

    const description = format(
      _("Remark.Variable.Sky.Condition.0", this.locale),
      _(`CloudQuantity.${firstQuantity}`, this.locale),
      _(`CloudQuantity.${secondQuantity}`, this.locale),
    );

    remark.push({
      type: RemarkType.VariableSky,
      description,
      raw: matches[0],

      cloudQuantityRange: [firstQuantity, secondQuantity],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
