import { RemarkCommandSupplier } from "command/remark";
import {
  IAbstractWeatherCode,
  IAbstractWeatherContainer,
  IFMValidity,
  ITemperatureDated,
  IValidity,
} from "model/model";
import * as converter from "../commons/converter";

/**
 * Parses the delivery time of a METAR/TAF
 * @param abstractWeatherCode The TAF or METAR object
 * @param timeString The string representing the delivery time
 */
function parseDeliveryTime(
  abstractWeatherCode: IAbstractWeatherCode,
  timeString: string
) {
  abstractWeatherCode.day = +timeString.slice(2);
  // TODO
  // abstractWeatherCode.time = new Date()
}

/**
 * This function parses the array containing the remark and concat the array into a string
 * @param container the metar, taf or taf trend to update
 * @param line The array containing the current line tokens
 * @param index the index starting the remark ie token RMK
 */
function parseRemark(
  container: IAbstractWeatherContainer,
  line: string[],
  index: number
) {
  const remarks = new RemarkParser().parse(line.slice(1).join(" "));

  container.remarks = remarks;
  container.remark = remarks.join(" ");
}

/**
 * Parses the temperature in a TAF
 * @param input the string containing the temperature
 * @returns TemperatureDated object
 */
function parseTemperature(input: string): ITemperatureDated {
  const parts = input.split("/");

  return {
    temperature: converter.convertTemperature(parts[0].slice(2)),
    day: +parts[1].slice(0, 2),
    hour: +parts[1].slice(2, 4),
  };
}

/**
 * Parses validity of a TAF or a TAFTrend
 * @param input the string containing the validity
 * @returns Validity object
 */
function parseValidity(input: string): IValidity {
  const parts = input.split("/");

  return {
    startDay: +parts[0].slice(0, 2),
    startHour: +parts[0].slice(2),
    endDay: +parts[1].slice(0, 2),
    endHour: +parts[1].slice(2),
  };
}

/**
 * Parses the validity for a FROM taf trend
 * @param input the string containing the validity
 * @returns a Validity object
 */
function parseFromValidity(input: string): IFMValidity {
  return {
    startDay: +input.slice(2, 4),
    startHour: +input.slice(4, 6),
    startMinutes: +input.slice(6, 8),
  };
}

/**
 * Abstract class.
 * Base parser.
 */
abstract class AbstractParser {}

class RemarkParser {
  #supplier = new RemarkCommandSupplier();

  parse(code: string): string[] {
    const rmkStr = code;
    const rmkList: string[] = [];

    while (rmkStr) {
      try {
        this.#supplier.get(rmkStr).execute(rmkStr, rmkList);
      } catch (e) {
        // TODO
        // if (e instanceof TranslationError) this.#supplier.defaultCommand.execute(rmkStr, rmkList)

        throw e;
      }
    }

    return rmkList;
  }
}
