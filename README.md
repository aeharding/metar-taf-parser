# ✈️ [metar-taf-parser](https://aeharding.github.io/metar-taf-parser)

Parser for METeorological Aerodrome Reports (METARs) and Terminal Aerodrome Forecasts (TAFs). This is a port of [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) to Typescript with some additional features.

[Check out the demo here](https://aeharding.github.io/metar-taf-parser)

Features:

- ✈️ Complete METAR and TAF parsing
- 🛠 Fully typed
- 🪶 Dependency free
- 🧪 Full test suite
- ✅ Runs anywhere: Web browser or Node
- 🌎 i18n: Translations
- 🌏 i18n: Handling international TAF & METAR report format differences
- 🌪 Remark parsing to human and machine readable formats
- 🗓 [`Forecast` abstraction](https://aeharding.github.io/metar-taf-parser/forecast) to easily query TAF reports by `Date`

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

// Optionally pass the date issued to add it to the report
const datedMetar = parseMetar(rawMetarString, { issued });
```

#### `parseTAF`

👉 **Note:** One of the common use cases for TAF reports is to get relevant forecast data for a given date. Check out [the `Forecast` abstraction](#higher-level-parsing-the-forecast-abstraction) below which may provide TAF data in a more normalized format, depending on your use case.

```ts
import { parseTAF } from "metar-taf-parser";

const taf = parseTAF(rawTAFString);

// -or-

// Optionally pass the date issued to get the report issued and
// trend validity dates (start/end) on the report:
const datedTAF = parseTAF(rawTAFString, { issued });
```

### Higher level parsing: The Forecast abstraction

TAF reports are a little funky... FM, BECMG, PROB, etc. You may find the `Forecast` abstraction more helpful.

#### `parseTAFAsForecast`

Returns a more normalized TAF report. Most notably: while the `parseTAF` function returns initial weather conditions on the base of the returned result (and further conditions on `trends[]`), the `parseTAFAsForecast` function returns the initial weather conditions as the first element of the `forecast[]` property, followed by subsequent trends. This makes it much easier to iterate though.

```ts
import { parseTAFAsForecast } from "metar-taf-parser";

// You must provide an issued date to use the Forecast abstraction
const report = parseTAFAsForecast(rawTAFString, { issued: tafIssuedDate });

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

const report = parseTAFAsForecast(rawTAFString, { issued: tafIssuedDate });

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
import de from "metar-taf-parser/locale/de";

const rawMetarReport = "KTTN 051853Z 04011KT RMK SLP176";

const metarResult = parseMetar(rawMetarReport, {
  locale: de,
});

console.log(metarReport.remarks[0].description);
```

## Handling remarks

Remarks may be found on base TAF and METARs, along with TAF trends.

Each Remark will have a `description` (if translated), `type` and `raw` properties. There are additional properties for each unique remark, depending on the remark's `type`. We can type guard on `type` to access these unique properties.

If the remark is not understood, it will have `type` as `RemarkType.Unknown`, with `raw` containing everything until the next understood remark.

### Example

```ts
import { Remark, RemarkType } from "metar-taf-parser";

/**
 * Find the sea level pressure given remarks, if defined
 */
function findSeaLevelPressure(remarks: Remark[]): number | undefined {
  for (const remark of remarks) {
    switch (remark.type) {
      case RemarkType.SeaLevelPressure:
        // can now access remark.pressure
        return remark.pressure;
    }
  }
}
```

## Development

### Example site

Please see [the example site README.md](example/README.md).

## Contributing

This project is based on [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) and the parsing should be as similar to that project as possible. That being said, PRs are welcome.

## Acknowledgment

This software port was made possible due to the fantastic work of [@mivek](https://github.com/mivek) in [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser). If you like this project, please [consider buying @mivek a coffee](https://ko-fi.com/mivek).
