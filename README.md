# ✈️ [metar-taf-parser](https://aeharding.github.io/metar-taf-parser)

Parser for METeorological Aerodrome Reports (METARs) and Terminal Aerodrome Forecasts (TAFs). This is a port of [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) to Typescript. It's dependency-free, fully typed, tested, has i18n support, and can run on Node or in the browser.

[Check out the demo here](https://aeharding.github.io/metar-taf-parser)

## Installation

```sh
yarn add metar-taf-parser
# or
npm i --save metar-taf-parser
```

## Usage

### Parsing

The `parseMetar` & `parseTAF` functions are designed to parse the raw report string into an object representation of a METAR/TAF.

#### `parseMetar`

```ts
import { parseMetar } from "metar-taf-parser";

const metar = parseMetar(rawMetarString);

// -or-

// Optionally pass a date (approximately when the report was issued, +/- a week)
// to get the issued date on the report:
const datedMetar = parseMetar(rawMetarString, { date: new Date() });
```

#### `parseTAF`

👉 **Note:** One of the common use cases for TAF reports is to get relevant forecast data for a given date. Check out [the `Forecast` abstraction](#higher-level-parsing-the-forecast-abstraction) below which may provide TAF data in a more normalized format, depending on your use case.

```ts
import { parseTAF } from "metar-taf-parser";

const taf = parseTAF(rawTAFString);

// -or-

// Optionally pass a date (approximately when the report was issued, +/- a week)
// to get the report issued and trend validity dates (start/end) on the report:
const datedTAF = parseTAF(rawTAFString, { date: new Date() });
```

### Higher level parsing: The Forecast abstraction

TAF reports are a little funky... FM, BECMG, PROB, etc. You may find the `Forecast` abstraction more helpful.

#### `parseTAFAsForecast`

Returns a more normalized TAF report. Most notably: while the `parseTAF` function returns initial weather conditions on the base of the returned result (and further conditions on `trends[]`), the `parseTAFAsForecast` function returns the initial weather conditions as the first element of the `forecast[]` property, followed by subsequent trends. This makes it much easier to iterate though.

```ts
import { parseTAFAsForecast } from "metar-taf-parser";

// You must provide an issued date to use the Forecast abstraction
const report = parseTAFAsForecast(rawTAFString, { date: tafIssuedDate });

console.log(report.forecast);
```

#### `getCompositeForecastForDate`

> ⚠️ **Warning:** Experimental API

Provides all relevant weather conditions for a given timestamp. It returns a `ICompositeForecast` with a `base` and `additional` component. The `base` component is the base weather condition period (the FM part of the report) - and there will always be one.

The `additional` property is an array of weather condition periods valid for the given timestamp (any `BECMG`, `PROB`, `TEMPO`, etc.)

You will still need to write some logic to use this API to determine what data to use - for example, if `additional[0].visibility` exists, use it over `base.visibility`.

#### Example

This example provides an array of hourly weather conditions over the duration of the TAF report.

```ts
import { eachHourOfInterval } from "date-fns";
import {
  parseTAFAsForecast,
  getCompositeForecastForDate,
} from "metar-taf-parser";

const report = parseTAFAsForecast(rawTAFString, { date: tafIssuedDate });

const forecastPerHour = eachHourOfInterval({
  start: report.start,
  end: report.end,
}).map((hour) => ({
  hour,
  ...getCompositeForecastForDate(hour, report),
}));
```

## i18n

The `description` property in the `Remark` is translated, if available.

```ts
import { parseMetar } from "metar-taf-parser";
import de from "metar-taf-parser/dist/locale/de";

const rawMetarReport = "KTTN 051853Z 04011KT RMK SLP176";

const metarResult = parseMetar(rawMetarReport, {
  locale: de,
});

console.log(metarReport.remarks[0].description);
```

## Development

### Example site

Please see [the example site README.md](example/README.md).

## Contributing

This project is based on [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) and the parsing should be as similar to that project as possible. That being said, PRs are welcome.

## Acknowledgment

This software port was made possible due to the fantastic work of [@mivek](https://github.com/mivek) in [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser). If you like this project, please [consider buying @mivek a coffee](https://ko-fi.com/mivek).
