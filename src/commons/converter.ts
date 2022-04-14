import { pySplit } from "helpers/helpers";
import { Distance } from "model/model";
import { DistanceUnit, ValueIndicator } from "model/enum";

export function degreesToCardinal(input: number | string) {
  const degrees = +input;

  if (isNaN(degrees)) return "VRB";

  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const ix = Math.floor((degrees + 11.25) / 22.5);

  return dirs[ix % 16];
}

export function convertVisibility(input: string): Distance {
  if (input === "9999")
    return {
      indicator: ValueIndicator.GreaterThan,
      value: +input,
      unit: DistanceUnit.Meters,
    };

  return {
    value: +input,
    unit: DistanceUnit.Meters,
  };
}

/**
 * @param input May start with P or M, and must end with SM
 * @returns Distance
 */
export function convertNauticalMilesVisibility(input: string): Distance {
  let indicator: ValueIndicator | undefined;
  let index = 0;
  if (input.startsWith("P")) {
    indicator = ValueIndicator.GreaterThan;
    index = 1;
  } else if (input.startsWith("M")) {
    indicator = ValueIndicator.LessThan;
    index = 1;
  }

  return {
    indicator,
    value: convertFractionalAmount(input.slice(index, -2)),
    unit: DistanceUnit.StatuteMiles,
  };
}

/**
 * Converts fractional and/or whole amounts
 *
 * Example "1/3", "1 1/3" and "1"
 */
export function convertFractionalAmount(input: string): number {
  const [whole, fraction] = input.split(" ");

  if (!fraction) return parseFraction(whole);

  return +whole + parseFraction(fraction);
}

function parseFraction(input: string): number {
  const [top, bottom] = input.split("/");

  if (!bottom) return +top;

  return Math.round((+top / +bottom) * 100) / 100;
}

export function convertTemperature(input: string): number {
  if (input.startsWith("M")) return -pySplit(input, "M")[1];

  return +input;
}

export function convertInchesMercuryToPascal(input: number): number {
  return 33.8639 * input;
}

/**
 * Converts number `.toFixed(1)` before outputting to match python implementation
 */
export function convertTemperatureRemarks(
  sign: string,
  temperature: string
): number {
  const temp = +temperature / 10;

  if (sign === "0") return temp;

  return -temp;
}

export function convertPrecipitationAmount(amount: string): number {
  return +amount / 100;
}
