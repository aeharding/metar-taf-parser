import { convertTemperatureRemarks } from "../../commons/converter";
import { format, _ } from "../../commons/i18n";
import { UnexpectedParseError } from "../../commons/errors";
import { IBaseRemark, RemarkType, Remark } from "../remark";
import { Command } from "./Command";

export interface IHourlyTemperatureDewPointRemark extends IBaseRemark {
  type: RemarkType.HourlyTemperatureDewPoint;

  /**
   * In C
   */
  temperature: number;

  /**
   * In C
   */
  dewPoint?: number;
}

export class HourlyTemperatureDewPointCommand extends Command {
  #regex = /^T([01])(\d{3})(([01])(\d{3}))?/;

  canParse(code: string): boolean {
    return this.#regex.test(code);
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const matches = code.match(this.#regex);

    if (!matches) throw new UnexpectedParseError("Match not found");

    const temperature = convertTemperatureRemarks(matches[1], matches[2]);

    if (!matches[3]) {
      const description = format(
        _("Remark.Hourly.Temperature.0", this.locale),
        temperature.toFixed(1)
      );

      remark.push({
        type: RemarkType.HourlyTemperatureDewPoint,
        description,
        raw: matches[0],

        temperature,
      });
    } else {
      const dewPoint = convertTemperatureRemarks(matches[4], matches[5]);
      const description = format(
        _("Remark.Hourly.Temperature.Dew.Point", this.locale),
        temperature.toFixed(1),
        dewPoint.toFixed(1)
      );

      remark.push({
        type: RemarkType.HourlyTemperatureDewPoint,
        description,
        raw: matches[0],

        temperature,
        dewPoint,
      });
    }

    return [code.replace(this.#regex, "").trim(), remark];
  }
}
