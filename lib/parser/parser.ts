import { RemarkCommandSupplier } from "command/remark";
import {
  IAbstractWeatherCode,
  IAbstractWeatherContainer,
  IFMValidity,
  isWeatherConditionValid,
  ITemperatureDated,
  IValidity,
  IWeatherCondition,
} from "model/model";
import * as converter from "commons/converter";
import { pySplit } from "helpers/helpers";
import { CommandSupplier } from "command/common";
import { Intensity, Phenomenon, Descriptive } from "model/enum";

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
  const parts = pySplit(input, "/");

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
  const parts = pySplit(input, "/");

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
export abstract class AbstractParser {
  #FM = "FM";
  #TEMPO = "TEMPO";
  #BECMG = "BECMG";
  #RMK = "RMK";
  #TOKENIZE_REGEX = /\s((?=\d\/\dSM)(?<!\s\d\s)|(?!\d\/\dSM))|=/;
  #INTENSITY_REGEX = /^(-|\+|VC)/;
  #CAVOK = "CAVOK";
  #commonSupplier = new CommandSupplier();

  parseWeatherCondition(input: string): IWeatherCondition {
    let intensity: Intensity | undefined;
    if (input.match(this.#INTENSITY_REGEX)) {
      const match = input.match(this.#INTENSITY_REGEX)?.[0];
      if (match) intensity = match as Intensity;
    }

    let descriptive: Descriptive | undefined;
    for (const key of Object.values(Descriptive)) {
      if (input.includes(key)) descriptive = key as Descriptive;
    }

    const weatherCondition: IWeatherCondition = {
      intensity,
      descriptive,
      phenomenons: [],
    };

    for (const key of Object.values(Phenomenon)) {
      if (input.includes(key))
        weatherCondition.phenomenons.push(key as Phenomenon);
    }

    return weatherCondition;
  }

  /**
   * Parses the message into different tokens
   * @param input The metar or TAF as string
   * @returns List of tokens
   */
  tokenize(input: string) {
    return input.split(this.#TOKENIZE_REGEX).filter((v) => v);
  }

  /**
   * Common parse method for METAR, TAF and trends object
   * @param abstractWeatherCode the object to update
   * @param input The token to parse
   * @returns True if the token was parsed false otherwise
   */
  generalParse(
    abstractWeatherContainer: IAbstractWeatherContainer,
    input: string
  ): boolean {
    if (this.#CAVOK === input) {
      abstractWeatherContainer.cavok = true;
      const distance = "> 10km";

      if (!abstractWeatherContainer.visibility)
        abstractWeatherContainer.visibility = {
          distance,
        };

      abstractWeatherContainer.visibility.distance = distance;

      return true;
    }

    const command = this.#commonSupplier.get(input);
    if (command) {
      return command.execute(abstractWeatherContainer, input);
    }

    const weatherCondition = this.parseWeatherCondition(input);

    if (isWeatherConditionValid(weatherCondition)) {
      abstractWeatherContainer.weatherConditions.push(weatherCondition);
      return true;
    }

    return false;
  }
}

export class RemarkParser {
  #supplier = new RemarkCommandSupplier();

  parse(code: string): string[] {
    let rmkStr = code;
    let rmkList: string[] = [];
    while (rmkStr) {
      try {
        [rmkStr, rmkList] = this.#supplier.get(rmkStr).execute(rmkStr, rmkList);
      } catch (e) {
        // TODO
        // if (e instanceof TranslationError) this.#supplier.defaultCommand.execute(rmkStr, rmkList)

        throw e;
      }
    }

    return rmkList;
  }
}
