# metar-taf-parser

This is a port of [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) to typescript. It's fully typed and tested with i18n support, and can run on Node or the browser.

## Example

⚠️ This project is an active work in progress. These examples do not currently work.

### Parse METAR

```ts
import { parseMetar } from 'metar-taf-parser'

// Get the raw METAR/TAF strings in your preferred way
// For example: https://www.aviationweather.gov/dataserver
const { metar } = await myService.getAirportData('KMSN')

// Readily serializable
const metarResult = parseMetar(metar)

// Your code here 🚀
```

### Parse TAF

```ts
import { parseTAF } from 'metar-taf-parser'

// Get the raw METAR/TAF strings in your preferred way
// For example: https://www.aviationweather.gov/dataserver
const { taf } = await myService.getAirportData('KMSN')

// Readily serializable
const tafResult = parseTAF(taf)

// Your code here 🚀
```

### i18n

```ts
import { parseMetar } from 'metar-taf-parser'
import de from 'metar-taf-parser/dist/locale/de'

const { metar } = await myService.getAirportData('KMSN')

const metarResult = parseMetar(metar, { locale: de })
```

## Development

### Example site

Please see [the example site README.md](example/README.md).