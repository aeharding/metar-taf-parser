import {
  getForecastFromTAF,
  getCompositeForecastForDate,
  TimestampOutOfBoundsError,
} from "forecast/forecast";
import { parseTAF, WeatherChangeType } from "index";

describe("getForecastFromTAF", () => {
  test("simple case", () => {
    const taf = parseTAF("TAF KMSN 142325Z 1500/1524", {
      issued: new Date("2022-04-14"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));
  });

  test("day passed is ahead", () => {
    const taf = parseTAF("TAF KMSN 142325Z 1500/1524", {
      issued: new Date("2022-04-17"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-14T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));
  });

  test("with validity rolling over to next month", () => {
    const taf = parseTAF("TAF KMSN 302325Z 0100/0124", {
      issued: new Date("2022-04-29"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-30T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-05-01T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-05-02T00:00:00.000Z"));
  });

  test("should have forecasts", () => {
    const taf = parseTAF(
      `
TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
    TEMPO 1500/1501 6SM -SHRASN BKN035
    FM150100 25012G25KT P6SM VCSH SCT040 BKN070
    FM150300 26011G21KT P6SM SCT080
    `,
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-14T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));

    expect(forecast.forecast).toHaveLength(4);
    expect(forecast.forecast[0].validity.start).toEqual(
      new Date("2022-04-15T00:00:00.000Z")
    );
    expect(forecast.forecast[0].validity.end).toBeUndefined();
    expect(forecast.forecast[1].validity.start).toEqual(
      new Date("2022-04-15T00:00:00.000Z")
    );
    expect(forecast.forecast[1].validity.end).toEqual(
      new Date("2022-04-15T01:00:00.000Z")
    );
    expect(forecast.forecast[2].validity.start).toEqual(
      new Date("2022-04-15T01:00:00.000Z")
    );
    expect(forecast.forecast[2].validity.end).toBeUndefined();
    expect(forecast.forecast[3].validity.start).toEqual(
      new Date("2022-04-15T03:00:00.000Z")
    );
    expect(forecast.forecast[3].validity.end).toBeUndefined();
  });

  test("should have right trend types", () => {
    const taf = parseTAF(
      `
TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
    TEMPO 1500/1501 6SM -SHRASN BKN035
    FM150100 25012G25KT P6SM VCSH SCT040 BKN070
    FM150300 26011G21KT P6SM SCT080
    `,
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.forecast).toHaveLength(4);
    expect(forecast.forecast[0].type).toBeUndefined();
    expect(forecast.forecast[0].raw).toBe(
      "TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070"
    );
    expect(forecast.forecast[1].type).toBe(WeatherChangeType.TEMPO);
    expect(forecast.forecast[1].raw).toBe("TEMPO 1500/1501 6SM -SHRASN BKN035");
    expect(forecast.forecast[2].type).toBe(WeatherChangeType.FM);
    expect(forecast.forecast[2].raw).toBe(
      "FM150100 25012G25KT P6SM VCSH SCT040 BKN070"
    );
    expect(forecast.forecast[3].type).toBe(WeatherChangeType.FM);
    expect(forecast.forecast[3].raw).toBe("FM150300 26011G21KT P6SM SCT080");
  });

  test("another TAF", () => {
    const taf = parseTAF(
      `
    TAF 
          AMD KMSN 152044Z 1521/1618 24009G16KT P6SM SCT100 
          TEMPO 1521/1523 BKN100 
         FM160000 27008KT P6SM SCT150 
         FM160300 30006KT P6SM FEW230 
         FM161700 30011G18KT P6SM BKN050
    `,
      { issued: new Date("2022/04/15 21:46") }
    );
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-15T20:44:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T21:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T18:00:00.000Z"));
  });

  describe("getCompositeForecastForDate", () => {
    const taf = parseTAF(
      `
    TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
        TEMPO 1500/1501 6SM -SHRASN BKN035
        FM150100 25012G25KT P6SM VCSH SCT040 BKN070
        FM150300 26011G21KT P6SM SCT080
        `,
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    test("finds TEMPO", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T00:00:00.000Z"),
        forecast
      );

      expect(composite.base).toBeDefined();
      expect(composite.additional).toHaveLength(1);
    });

    test("finds FM @ start, without the TEMPO (exclusive end validity)", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T01:00:00.000Z"),
        forecast
      );

      expect(composite.base).toBeDefined();
      expect(composite.additional).toHaveLength(0);
    });

    test("throws out of bounds", () => {
      expect(() =>
        getCompositeForecastForDate(
          new Date("2023-04-15T00:00:00.000Z"),
          forecast
        )
      ).toThrowError(TimestampOutOfBoundsError);

      expect(() =>
        getCompositeForecastForDate(
          new Date("2020-04-15T00:00:00.000Z"),
          forecast
        )
      ).toThrowError(TimestampOutOfBoundsError);
    });
  });
});
