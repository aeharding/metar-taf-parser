import { Remark, RemarkCommandSupplier } from "command/remark";
import {
  IAbstractWeatherCode,
  IAbstractWeatherContainer,
  IFMValidity,
  IMetar,
  IMetarTrend,
  IMetarTrendTime,
  isWeatherConditionValid,
  ITAF,
  TAFTrend,
  ITemperature,
  IValidity,
  IWeatherCondition,
  IValidityDated,
  IFlags,
} from "model/model";
import { DistanceUnit, MetarType, ValueIndicator } from "model/enum";
import * as converter from "commons/converter";
import { pySplit } from "helpers/helpers";
import { CommandSupplier } from "command/common";
import {
  Intensity,
  Phenomenon,
  Descriptive,
  TimeIndicator,
  WeatherChangeType,
} from "model/enum";
import { CommandSupplier as MetarCommandSupplier } from "command/metar";
import { CommandSupplier as TafCommandSupplier } from "command/taf";
import { Locale } from "commons/i18n";
import { CommandExecutionError } from "commons/errors";

function isStation(stationString: string): boolean {
  return stationString.length === 4;
}

/**
 * Parses the delivery time of a METAR/TAF
 * @param abstractWeatherCode The TAF or METAR object
 * @param timeString The string representing the delivery time
 */
function parseDeliveryTime(
  timeString: string
): Pick<IAbstractWeatherCode, "day" | "hour" | "minute"> | undefined {
  const day = +timeString.slice(0, 2);
  const hour = +timeString.slice(2, 4);
  const minute = +timeString.slice(4, 6);

  if (isNaN(day) || isNaN(hour) || isNaN(minute)) return;

  return {
    day,
    hour,
    minute,
  };
}

function parseFlags(
  abstractWeatherCode: IAbstractWeatherCode,
  flag: string
): boolean {
  const flags = findFlags(flag);

  if (flags) Object.assign(abstractWeatherCode, flags);

  return !!flags;
}

enum FlagMap {
  AMD = "amendment",
  AUTO = "auto",
  CNL = "canceled",
  COR = "corrected",
  NIL = "nil",
}

function findFlags(flag: string): IFlags | undefined {
  if (flag in FlagMap) return { [FlagMap[flag as keyof typeof FlagMap]]: true };
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
  index: number,
  locale: Locale
) {
  const remarks = new RemarkParser(locale).parse(
    line.slice(index + 1).join(" ")
  );

  container.remarks = remarks;
  container.remark = remarks
    .map(({ description, raw }) => description || raw)
    .join(" ");
}

/**
 * Parses the temperature in a TAF
 * @param input the string containing the temperature
 * @returns TemperatureDated object
 */
export function parseTemperature(input: string): ITemperature {
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
export function parseValidity(input: string): IValidityDated | IValidity {
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
  FM = "FM";
  TEMPO = "TEMPO";
  INTER = "INTER";
  BECMG = "BECMG";
  RMK = "RMK";

  // Safari does not currently support negative lookbehind
  // #TOKENIZE_REGEX = /\s((?=\d\/\dSM)(?<!\s\d\s)|(?!\d\/\dSM))|=/;
  #INTENSITY_REGEX = /^(-|\+|VC)/;
  #CAVOK = "CAVOK";
  #commonSupplier = new CommandSupplier();

  constructor(protected locale: Locale) {}

  parseWeatherCondition(input: string): IWeatherCondition | undefined {
    let intensity: Intensity | undefined;
    if (input.match(this.#INTENSITY_REGEX)) {
      const match = input.match(this.#INTENSITY_REGEX)?.[0];
      if (match) {
        intensity = match as Intensity;
        input = input.slice(match.length);
      }
    }

    let descriptive: Descriptive | undefined;
    const descriptives = Object.values(Descriptive);
    for (let i = 0; i < descriptives.length; i++) {
      const key = descriptives[i];

      if (input.startsWith(key)) {
        descriptive = key as Descriptive;
        input = input.slice(key.length);
        break;
      }
    }

    const weatherCondition: IWeatherCondition = {
      intensity,
      descriptive,
      phenomenons: [],
    };

    const phenomenons = Object.values(Phenomenon);
    for (let i = 0; i < phenomenons.length; i++) {
      const key = phenomenons[i];

      // Thunderstorm as descriptive should not be added as a phenomenon
      if ((descriptive as string) === key) continue;

      // Phenomenons can be separated with a slash
      const conditionRegex = new RegExp(`^\/?${key}`);
      const inputMatch = input.match(conditionRegex)?.[0];
      if (inputMatch) {
        weatherCondition.phenomenons.push(key as Phenomenon);
        input = input.slice(inputMatch.length);

        // Restart the search for an additional phenomenon
        i = -1;
        continue;
      }
    }

    // If anything is left unparsed, it's not a valid weather condition
    if (input.replace(/\//g, "").length) return;

    return weatherCondition;
  }

  /**
   * Parses the message into different tokens
   * @param input The metar or TAF as string
   * @returns List of tokens
   */
  tokenize(input: string) {
    // Missing safari support. If added in the future, put this back
    // return input.split(this.#TOKENIZE_REGEX).filter((v) => v);

    // Hack for safari below...
    const splitRegex = /\s|=/;
    const smRegex = /^\d\/\dSM$/;
    const digitRegex = /^(P|M)?\d$/;

    // return input.split(this.#TOKENIZE_REGEX).filter((v) => v);
    const splitted = input.split(splitRegex);

    for (let i = 0; i < splitted.length; i++) {
      if (digitRegex.test(splitted[i])) {
        if (splitted[i + 1] && smRegex.test(splitted[i + 1])) {
          splitted.splice(i, 2, `${splitted[i]} ${splitted[i + 1]}`);
        }
      }
    }

    return splitted.filter((t) => t);
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
    if (input === this.#CAVOK) {
      abstractWeatherContainer.cavok = true;
      abstractWeatherContainer.visibility = {
        indicator: ValueIndicator.GreaterThan,
        value: 9999,
        unit: DistanceUnit.Meters,
      };

      return true;
    }

    const weatherCondition = this.parseWeatherCondition(input);

    if (weatherCondition && isWeatherConditionValid(weatherCondition)) {
      abstractWeatherContainer.weatherConditions.push(weatherCondition);
      return true;
    }

    const command = this.#commonSupplier.get(input);

    if (command) {
      try {
        return command.execute(abstractWeatherContainer, input);
      } catch (error) {
        if (error instanceof CommandExecutionError) return false;
        throw error;
      }
    }

    return false;
  }
}

export class MetarParser extends AbstractParser {
  AT = "AT";
  TL = "TL";
  #commandSupplier = new MetarCommandSupplier();

  /**
   * Parses a trend of a metar
   * @param index the index starting the trend in the list
   * @param trend The trend to update
   * @param trendParts array of tokens
   * @returns the last index of the token that was last parsed
   */
  parseTrend(index: number, trend: IMetarTrend, trendParts: string[]): number {
    let i = index + 1;

    while (
      i < trendParts.length &&
      trendParts[i] !== this.TEMPO &&
      trendParts[i] !== this.INTER &&
      trendParts[i] !== this.BECMG
    ) {
      if (
        trendParts[i].startsWith(this.FM) ||
        trendParts[i].startsWith(this.TL) ||
        trendParts[i].startsWith(this.AT)
      ) {
        const trendTime: IMetarTrendTime = {
          type: TimeIndicator[trendParts[i].slice(0, 2) as TimeIndicator],
          hour: +trendParts[i].slice(2, 4),
          minute: +trendParts[i].slice(4, 6),
        };

        trend.times.push(trendTime);
      } else {
        this.generalParse(trend, trendParts[i]);
      }

      i = i + 1;
    }

    return i - 1;
  }

  /**
   * Parses an message and returns a METAR
   * @param input The message to parse
   * @returns METAR
   */
  parse(input: string): IMetar {
    const metarTab = this.tokenize(input);

    let index = 0;

    const type = this.parseType(metarTab[index]);
    if (type) index++;

    // Only parse flag if precedes station identifier
    if (isStation(metarTab[index + 1])) {
      var flags = findFlags(metarTab[index]);
      if (flags) index += 1;
    }

    const metar: IMetar = {
      type,
      station: metarTab[index],
      ...parseDeliveryTime(metarTab[index + 1]),
      ...flags,
      message: input,
      remarks: [],
      clouds: [],
      weatherConditions: [],
      trends: [],
      runwaysInfo: [],
    };

    index += 2;

    while (index < metarTab.length) {
      if (
        !super.generalParse(metar, metarTab[index]) &&
        !parseFlags(metar, metarTab[index])
      ) {
        if (metarTab[index] === "NOSIG") {
          metar.nosig = true;
        } else if (
          metarTab[index] === this.TEMPO ||
          metarTab[index] === this.INTER ||
          metarTab[index] === this.BECMG
        ) {
          const startIndex = index;

          const trend: IMetarTrend = {
            type: WeatherChangeType[metarTab[index] as WeatherChangeType],
            weatherConditions: [],
            clouds: [],
            times: [],
            remarks: [],
            raw: "",
          };

          index = this.parseTrend(index, trend, metarTab);
          trend.raw = metarTab.slice(startIndex, index + 1).join(" ");

          metar.trends.push(trend);
        } else if (metarTab[index] === this.RMK) {
          parseRemark(metar, metarTab, index, this.locale);
          break;
        } else {
          const command = this.#commandSupplier.get(metarTab[index]);
          if (command) command.execute(metar, metarTab[index]);
        }
      }

      index = index + 1;
    }

    return metar;
  }

  parseType(token: string): MetarType | undefined {
    for (const type in MetarType) {
      if (token === MetarType[type as MetarType]) return type as MetarType;
    }
  }
}

/**
 * Parser for TAF messages
 */
export class TAFParser extends AbstractParser {
  TAF = "TAF";
  PROB = "PROB";
  TX = "TX";
  TN = "TN";

  #commandSupplier = new TafCommandSupplier();

  #validityPattern = /^\d{4}\/\d{4}$/;

  /**
   * TAF messages can be formatted poorly
   *
   * Attempt to handle those situations gracefully
   */
  parseMessageStart(input: string[]): [number, IFlags | undefined] {
    let index = 0;

    if (input[index] === this.TAF) index += 1;
    if (input[index + 1] === this.TAF) index += 2;

    const flags1 = findFlags(input[index]);
    if (flags1) index += 1;

    if (input[index] === this.TAF) index += 1;

    const flags2 = findFlags(input[index]);
    if (flags2) index += 1;

    return [index, { ...flags1, ...flags2 }];
  }

  /**
   * the message to parse
   * @param input
   * @returns a TAF object
   * @throws ParseError if the message is invalid
   */
  parse(input: string): ITAF {
    const lines = this.extractLinesTokens(input);

    let [index, flags] = this.parseMessageStart(lines[0]);

    const station = lines[0][index];
    index += 1;
    const time = parseDeliveryTime(lines[0][index]);
    if (time) index += 1;
    const validity = parseValidity(lines[0][index]);

    const taf: ITAF = {
      station,
      ...flags,
      ...time,
      validity,
      message: input,
      trends: [],
      remarks: [],
      clouds: [],
      weatherConditions: [],
      initialRaw: lines[0].join(" "),
    };

    for (let i = index + 1; i < lines[0].length; i++) {
      const token = lines[0][i];

      const tafCommand = this.#commandSupplier.get(token);

      if (token == this.RMK) {
        parseRemark(taf, lines[0], i, this.locale);
        break;
      } else if (tafCommand) {
        tafCommand.execute(taf, token);
      } else {
        this.generalParse(taf, token);
        parseFlags(taf, token);
      }
    }

    const minMaxTemperatureLines = [
      lines[0].slice(index + 1), // EU countries have min/max in first line
    ];

    // US military bases have min/max in last line
    if (lines.length > 1) minMaxTemperatureLines.push(lines[lines.length - 1]);

    this.parseMaxMinTemperatures(taf, minMaxTemperatureLines);

    // Handle the other lines
    for (let i = 1; i < lines.length; i++) {
      this.parseLine(taf, lines[i]);
    }

    return taf;
  }

  parseMaxMinTemperatures(taf: ITAF, lines: string[][]) {
    for (const line of lines) {
      for (const token of line) {
        if (token == this.RMK) break;
        else if (token.startsWith(this.TX))
          taf.maxTemperature = parseTemperature(token);
        else if (token.startsWith(this.TN))
          taf.minTemperature = parseTemperature(token);
      }
    }
  }

  /**
   * Format the message as a multiple line code so each line can be parsed
   * @param tafCode The base message
   * @returns a list of string representing the lines of the message
   */
  extractLinesTokens(tafCode: string): string[][] {
    const singleLine = tafCode.replace(/\n/g, " ");
    const cleanLine = singleLine.replace(/\s{2,}/g, " ");
    const lines = joinProbIfNeeded(
      cleanLine
        .replace(
          /\s(?=PROB\d{2}\s(?=TEMPO|INTER)|TEMPO|INTER|BECMG|FM(?![A-Z]{2}\s)|PROB)/g,
          "\n"
        )
        .split(/\n/)
    );

    // TODO cleanup
    function joinProbIfNeeded(ls: string[]): string[] {
      for (let i = 0; i < ls.length; i++) {
        if (/^PROB\d{2}$/.test(ls[i]) && /^TEMPO|INTER/.test(ls[i + 1])) {
          ls.splice(i, 2, `${ls[i]} ${ls[i + 1]}`);
        }
      }
      return ls;
    }
    const linesToken = lines.map(this.tokenize);

    return linesToken;
  }

  /**
   * Parses the tokens of the line and updates the TAF object
   * @param taf TAF object to update
   * @param lineTokens the array of tokens representing a line
   */
  parseLine(taf: ITAF, lineTokens: string[]) {
    let index = 1;
    let trend: TAFTrend;

    if (lineTokens[0].startsWith(this.FM)) {
      trend = {
        ...this.makeEmptyTAFTrend(),
        type: WeatherChangeType.FM,
        validity: parseFromValidity(lineTokens[0]),
        raw: lineTokens.join(" "),
      };
    } else if (lineTokens[0].startsWith(this.PROB)) {
      const validity = this.findLineValidity(index, lineTokens);
      if (!validity) return;

      trend = {
        ...this.makeEmptyTAFTrend(),
        type: WeatherChangeType.PROB,
        validity,
        raw: lineTokens.join(" "),
      };

      if (
        lineTokens.length > 1 &&
        (lineTokens[1] === this.TEMPO || lineTokens[1] === this.INTER)
      ) {
        trend = {
          ...this.makeEmptyTAFTrend(),
          type: WeatherChangeType[lineTokens[1] as WeatherChangeType],
          validity,
          raw: lineTokens.join(" "),
        };
        index = 2;
      }

      trend.probability = +lineTokens[0].slice(4);
    } else {
      const validity = this.findLineValidity(index, lineTokens);
      if (!validity) return;

      trend = {
        ...this.makeEmptyTAFTrend(),
        type: WeatherChangeType[lineTokens[0] as WeatherChangeType],
        validity,
        raw: lineTokens.join(" "),
      };
    }

    this.parseTrend(index, lineTokens, trend);
    taf.trends.push(trend);
  }

  /**
   * Finds a non-FM validity in a line
   * @param index the index at which the array should be parsed
   * @param line The array of string containing the line
   * @param trend The trend object to update
   */
  findLineValidity(index: number, line: string[]): IValidity | undefined {
    let validity: IValidity | undefined;

    for (let i = index; i < line.length; i++) {
      if (this.#validityPattern.test(line[i]))
        validity = parseValidity(line[i]);
    }

    return validity;
  }

  /**
   * Parses a trend of the TAF
   * @param index the index at which the array should be parsed
   * @param line The array of string containing the line
   * @param trend The trend object to update
   */
  parseTrend(index: number, line: string[], trend: TAFTrend) {
    for (let i = index; i < line.length; i++) {
      const tafCommand = this.#commandSupplier.get(line[i]);

      if (line[i] === this.RMK) {
        parseRemark(trend, line, i, this.locale);
        break;
      }
      // already parsed
      else if (this.#validityPattern.test(line[i])) continue;
      else if (tafCommand) {
        tafCommand.execute(trend, line[i]);
      } else super.generalParse(trend, line[i]);
    }
  }

  makeEmptyTAFTrend(): Omit<TAFTrend, "type" | "validity" | "raw"> {
    return {
      remarks: [],
      clouds: [],
      weatherConditions: [],
    };
  }
}

export class RemarkParser {
  constructor(private locale: Locale) {}

  #supplier = new RemarkCommandSupplier(this.locale);

  parse(code: string): Remark[] {
    let rmkStr = code;
    let rmkList: Remark[] = [];
    while (rmkStr) {
      try {
        [rmkStr, rmkList] = this.#supplier.get(rmkStr).execute(rmkStr, rmkList);
      } catch (e) {
        if (e instanceof CommandExecutionError) {
          [rmkStr, rmkList] = this.#supplier.defaultCommand.execute(
            rmkStr,
            rmkList
          );
        } else {
          throw e;
        }
      }
    }

    return rmkList;
  }
}
