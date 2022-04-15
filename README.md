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

The `parseMetar` & `parseTAF` functions are designed to parse the raw report string into an object representation of a METAR/TAF. However, these functions do not make any assumptions about how you want to use that data. That is to say, the data may require further processing in order to be useful for your application - especially for TAF reports. (See the `Forecast` abstraction below for higher level parsing.)

#### Parse a METAR

```ts
import { parseMetar } from "metar-taf-parser";

const metar = parseMetar(rawMetarString);

// Optionally pass a date (approximately when the report was issued, +/- a week)
// to get the issued date on the report:
const datedMetar = parseMetar(rawMetarString, { date: new Date() });
```

#### Parse a TAF

👉 **Note:** One of the common use cases for TAF reports is to get relevant forecast data for a given date. Check out [the `Forecast` abstraction](#the-forecast-abstraction) below which may provide TAF data in a more digestable format.

```ts
import { parseTAF } from "metar-taf-parser";

const taf = parseTAF(rawTAFString);

// -or-

// Optionally pass a date (approximately when the report was issued, +/- a week)
// to get the report issued and trend validity dates (start/end) on the report:
const datedTAF = parseTAF(rawTAFString, { date: new Date() });
```

### Higher level parsing: The `Forecast` abstraction

TAF reports are a little funky... FM, BECMG, PROB, etc. You may find the `Forecast` abstraction more helpful. This provides a way to get relevant forecast information for a given `Date`. Check it out:

```ts
import { parseTAF } from "metar-taf-parser";

// You must provide a date to get a forecast for a TAF
const datedTAF = parseMetar(rawTAFString, { date: new Date() });
const forecast = getForecastFromTAF(datedTAF);

const currentConditions = getCompositeForecastForDate(new Date(), forecast);

console.log(currentConditions);
```

You could also build a table that lists conditions per hour very easily. For example:

```ts
import { parseTAF } from "metar-taf-parser";
import { eachHourOfInterval } from "date-fns";

const datedTAF = parseMetar(rawTAFString, { date: new Date() });
const forecast = getForecastFromTAF(datedTAF);

const forecastPerHour = eachHourOfInterval({
  start: forecast.start,
  end: forecast.end,
}).map((hour) => ({
  hour,
  ...getCompositeForecastForDate(hour, forecast),
}));
```

## i18n

```ts
import { parseMetar } from "metar-taf-parser";
import de from "metar-taf-parser/dist/locale/de";

const { metar } = await myService.getAirportData("KMSN");

const metarResult = parseMetar(metar, { locale: de });
```

## Development

### Example site

Please see [the example site README.md](example/README.md).

## Contributing

This project is based on [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) and the parsing should be as similar to that project as possible. That being said, PRs are welcome.

## Acknowledgment

This software port was made possible due to the fantastic work of [@mivek](https://github.com/mivek) in [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser). If you like this project, please [consider buying @mivek a coffee](https://ko-fi.com/mivek).
