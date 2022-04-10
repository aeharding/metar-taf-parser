# metar-taf-parser

This is a port of [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) to Typescript. It's fully typed and tested with i18n support, and can run on Node or the browser.

## Example

### Parse METAR

```ts
import { parseMetar } from 'metar-taf-parser'

// Get the raw METAR/TAF strings in your preferred way
// For example: https://www.aviationweather.gov/dataserver
// const { metar } = await myService.getAirportData('KMSN')

// Readily serializable
const metarResult = parseMetar(metar)

// Your code here 🚀
```

### Parse TAF

```ts
import { parseTAF } from 'metar-taf-parser'

// Get the raw METAR/TAF strings in your preferred way
// For example: https://www.aviationweather.gov/dataserver
// const { taf } = await myService.getAirportData('KMSN')

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

## Contributing

This project is intended to provide feature parity with [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser) and will only accept PRs to maintain feature parity or to fix inconsistencies with that project.

## Development

### Example site

Please see [the example site README.md](example/README.md).

## Acknowledgment

This software port was made possible due to the fantastic work of [@mivek](https://github.com/mivek) in [python-metar-taf-parser](https://github.com/mivek/python-metar-taf-parser). If you like this project, please [consider buying @mivek a coffee](https://ko-fi.com/mivek).