import { pySplit } from "helpers/helpers";

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

export function convertVisibility(input: string): string {
  if (input === "9999") return "> 10km";

  return `${input}m`;
}

export function convertTemperature(input: string): number {
  if (input.startsWith("M")) return -pySplit(input, "M")[1];

  return +input;
}

export function convertInchesMercuryToPascal(input: number): number {
  return 33.8639 * input;
}

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
