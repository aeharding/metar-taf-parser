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
pnpm i metar-taf-parser
# or
npm i --save metar-taf-parser
```

## Usage

### Parsing

The `parseMetar` & `parseTAF` functions are designed to parse the raw report string into an object representation of a METAR/TAF.

#### `parseMetar`

If the payload begins with [`METAR` or `SPECI`](http://www.bom.gov.au/aviation/data/education/metar-speci.pdf), that will be added as the `type`.

```ts
import { parseMetar } from "metar-taf-parser";

const metar = parseMetar(rawMetarString);

// -or-

// Optionally pass the date issued to add it to the report
const datedMetar = parseMetar(rawMetarString, { issued });
```

#### `parseTAF`

> 👉 **Note:** One of the common use cases for TAF reports is to get relevant forecast data for a given `Date`, or display the various forecast groups to the user. Check out [the `Forecast` abstraction](#higher-level-parsing-the-forecast-abstraction) below which may provide TAF data in a more normalized and easier to use format, depending on your use case.

```ts
import { parseTAF } from "metar-taf-parser";

const taf = parseTAF(rawTAFString);

// -or-

// Optionally pass the date issued to get the report issued and
// trend validity dates (start/end) on the report:
const datedTAF = parseTAF(rawTAFString, { issued });
```

### Higher level parsing: The Forecast abstraction

TAF reports are a little funky... FM, BECMG, PROB, weird validity periods, etc. You may find the higher level `Forecast` abstraction more helpful.

⚠️ **Important:** The `Forecast` abstraction makes some assumptions in order to make it easier to consume the TAF. If you want different behavior, you may want to use the lower level `parseTAF` function directly (see above). Below are some of the assumptions the `Forecast` API makes:

1.  The `validity` object found from `parseTAF`'s `trends[]` is too low level, so it is removed. Instead, you will find `start` and `end` on the base `Forecast` object. The end of a `FM` and `BECMG` group is derived from the start of the next `FM`/`BECMG` trend, or the end of the report validity if the last.

    Additionally, there is a property, `by`, on `BECMG` trends for when conditions are expected to finish transitioning. You will need to type guard `type = BECMG` to access this property.

    ```ts
    const firstForecast = report.forecast[1];
    if (firstForecast.type === WeatherChangeType.BECMG) {
      // Can now access `by`
      console.log(firstForecast.by);
    }
    ```

2.  `BECMG` trends are hydrated with the context of previous trends. For example, if:

        TAF SBBR 221500Z 2218/2318 15008KT 9999 FEW045
          BECMG 2308/2310 09002KT

    Then the `BECMG` group will also have visibility and clouds from previously found conditions, with updated winds.

#### `parseTAFAsForecast`

Returns a more normalized TAF report than `parseTAF`. Most notably: while the `parseTAF` function returns initial weather conditions on the base of the returned result (and further conditions on `trends[]`), the `parseTAFAsForecast` function returns the initial weather conditions as the first element of the `forecast[]` property (with `type = undefined`), followed by subsequent trends. (For more, please see the above about the forecast abstraction.) This makes it much easier to render a UI similar to the [aviationweather.gov](https://www.aviationweather.gov/taf/data?ids=SBPJ&format=decoded&metars=off&layout=on) TAF decoder.

```ts
import { parseTAFAsForecast } from "metar-taf-parser";

// You must provide an issued date to use the Forecast abstraction
const report = parseTAFAsForecast(rawTAFString, { issued: tafIssuedDate });

console.log(report.forecast);
```

#### `getCompositeForecastForDate`

> ⚠️ **Warning:** Experimental API

Provides all relevant weather conditions for a given timestamp. It returns an `ICompositeForecast` with a `prevailing` and `supplemental` component. The `prevailing` component is the prevailing weather condition period (type = `FM`, `BECMG`, or `undefined`) - and there will always be one.

The `supplemental` property is an array of weather condition periods valid for the given timestamp (any `PROB`, `TEMPO` and/or `INTER`) - conditions that are ephemeral and/or lower probability.

You will still need to write some logic to determine what data to use - for example, if `supplemental[0].visibility` exists, you may want to use it over `prevailing.visibility`, or otherwise present it to the user.

This function throws a `TimestampOutOfBoundsError` if the provided date is outside of the report validity period.

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

## Determining flight category, ceiling, etc

Because certain abstractions such as flight category and flight ceiling can vary by country, this logic is left up to you to implement. However, if you're looking for somewhere to start, check out the example site (based on United States flight rules) in [example/src/helpers/metarTaf.ts](https://github.com/aeharding/metar-taf-parser/blob/main/example/src/helpers/metarTaf.ts). Feel free to copy - it's MIT licensed.

## Development

### Example site

Please see [the example site README.md](example/README.md).

## Contributing

This project is based on [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) and the parsing should be as similar to that project as possible. That being said, PRs are welcome.

## Acknowledgment

This software port was made possible due to the fantastic work of [@mivek](https://github.com/mivek) in [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser). If you like this project, please [consider buying @mivek a coffee](https://ko-fi.com/mivek).
