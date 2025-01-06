import { UnexpectedParseError } from "commons/errors";
import { IMetar } from "model/model";
import { as } from "helpers/helpers";
import {
  DepositCoverage,
  DepositType,
  RunwayInfoTrend,
  RunwayInfoUnit,
  ValueIndicator,
} from "model/enum";
import { ICommand } from "../metar";

export class RunwayCommand implements ICommand {
  #genericRegex = /^(R\d{2}\w?\/)/;
  #runwayMaxRangeRegex =
    /^R(\d{2}\w?)\/(\d{4})V(\d{3,4})(?:([UDN])|(FT)(?:\/([UDN]))?)$/;
  #runwayRegex = /^R(\d{2}\w?)\/([MP])?(\d{4})(?:([UDN])|(FT)(?:\/([UDN]))?)$/;
  #runwayDepositRegex = /^R(\d{2}\w?)\/([/\d])([/\d])(\/\/|\d{2})(\/\/|\d{2})$/;

  canParse(input: string): boolean {
    return this.#genericRegex.test(input);
  }

  execute(metar: IMetar, input: string) {
    if (this.#runwayDepositRegex.test(input)) {
      const matches = input.match(this.#runwayDepositRegex);

      if (!matches) throw new UnexpectedParseError("Should be able to parse");

      const depositType = as(matches[2], DepositType);
      const coverage = as(matches[3], DepositCoverage);

      metar.runwaysInfo.push({
        name: matches[1],
        depositType,
        coverage,
        thickness: matches[4],
        brakingCapacity: matches[5],
      });
    } else if (this.#runwayRegex.test(input)) {
      const matches = input.match(this.#runwayRegex);

      if (!matches) throw new UnexpectedParseError("Should be able to parse");

      const indicator = matches[2] ? as(matches[2], ValueIndicator) : undefined;
      const trend = (() => {
        if (matches[6]) return as(matches[6], RunwayInfoTrend);
        if (matches[4]) return as(matches[4], RunwayInfoTrend);
      })();

      const unit = matches[5]
        ? as(matches[5], RunwayInfoUnit)
        : RunwayInfoUnit.Meters;

      metar.runwaysInfo.push({
        name: matches[1],
        indicator,
        minRange: +matches[3],
        trend,
        unit,
      });
    } else if (this.#runwayMaxRangeRegex.test(input)) {
      const matches = input.match(this.#runwayMaxRangeRegex);

      if (!matches) throw new UnexpectedParseError("Should be able to parse");

      const trend = (() => {
        if (matches[6]) return as(matches[6], RunwayInfoTrend);
        if (matches[4]) return as(matches[4], RunwayInfoTrend);
      })();
      const unit = matches[5]
        ? as(matches[5], RunwayInfoUnit)
        : RunwayInfoUnit.Meters;

      metar.runwaysInfo.push({
        name: matches[1],
        minRange: +matches[2],
        maxRange: +matches[3],
        trend,
        unit,
      });
    }
  }
}
