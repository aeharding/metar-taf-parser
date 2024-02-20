import * as metarTafParser from "metar-taf-parser";

console.log(
  "%c✈️ metar-taf-parser available in console",
  "font-size: 16px; color: #87CEEB; font-weight: bold",
);
console.log(
  "ℹ️ Try calling %cparseMetar('KEKO 260056Z AUTO 28003KT 10SM CLR 08/M02 A3008 RMK AO2 SLP178 T00781017')",
  "font-family: monospace; background: black;",
);
console.log(
  "ℹ️ Parsed data is available on %cwindow.result",
  "font-family: monospace; background: black;",
);

// Expose for people to use in the console
Object.assign(window as any, metarTafParser);
(window as any).metarTafParser = metarTafParser;
