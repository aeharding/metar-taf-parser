import { as } from "helpers/helpers";
import { format, _ } from "commons/i18n";
import { UnexpectedParseError } from "commons/errors";
import { CloudQuantity } from "model/enum";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IVariableSkyHeightRemark extends IBaseRemark {
  type: RemarkType.VariableSkyHeight;
  height: number;
  cloudQuantityRange: [CloudQuantity, CloudQuantity];
}

export class VariableSkyHeightCommand extends Command {
  #regex = /^([A-Z]{3})(\d{3}) V ([A-Z]{3})/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const firstQuantity = as(matches[1], CloudQuantity);
    const secondQuantity = as(matches[3], CloudQuantity);

    const height = 100 * +matches[2];
    const description = format(
      _("Remark.Variable.Sky.Condition.Height", this.locale),
      height,
      _(`CloudQuantity.${firstQuantity}`, this.locale),
      _(`CloudQuantity.${secondQuantity}`, this.locale),
    );

    remark.push({
      type: RemarkType.VariableSkyHeight,
      description,
      raw: matches[0],

      height,
      cloudQuantityRange: [firstQuantity, secondQuantity],
    });

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
