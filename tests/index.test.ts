import {
  parseMetar,
  parseTAF,
  parseTAFAsForecast,
  WeatherChangeType,
} from "index";

describe("public API", () => {
  describe("parseMetar", () => {
    test("parses", () => {
      expect(parseMetar("LFPG 161430Z 24015G25KT 5000 1100w").station).toBe(
        "LFPG"
      );
    });

    test("parses with date", () => {
      expect(
        parseMetar("LFPG 161430Z 24015G25KT 5000 1100w", {
          date: new Date("2022-01-16"),
        }).issued
      ).toEqual(new Date("2022-01-16T14:30:00.000Z"));
    });
  });

  describe("parseTAF", () => {
    const rawTAF = `
TAF 
    AMD KMSN 152044Z 1521/1618 24009G16KT P6SM SCT100 
    TEMPO 1521/1523 BKN100 
   FM160000 27008KT P6SM SCT150 
   FM160300 30006KT P6SM FEW230 
   FM161700 30011G18KT P6SM BKN050
   `;

    test("parses", () => {
      expect(parseTAF(rawTAF).station).toBe("KMSN");
    });

    describe("with date", () => {
      test("sets issued", () => {
        expect(
          parseTAF(rawTAF, {
            date: new Date("2022-01-16"),
          }).issued
        ).toEqual(new Date("2022-01-15T20:44:00.000Z"));
      });

      test("sets validity", () => {
        const tafDated = parseTAF(rawTAF, {
          date: new Date("2022-01-16"),
        });

        expect(tafDated.validity.start).toEqual(
          new Date("2022-01-15T21:00:00.000Z")
        );
        expect(tafDated.validity.end).toEqual(
          new Date("2022-01-16T18:00:00.000Z")
        );
      });

      test("sets trend validity", () => {
        const tafDated = parseTAF(rawTAF, {
          date: new Date("2022-01-16"),
        });

        expect(tafDated.trends).toHaveLength(4);
        expect(tafDated.trends[0].type).toBe(WeatherChangeType.TEMPO);
        expect(tafDated.trends[0].validity.start).toEqual(
          new Date("2022-01-15T21:00:00.000Z")
        );
        expect(tafDated.trends[0].validity.end).toEqual(
          new Date("2022-01-15T23:00:00.000Z")
        );

        expect(tafDated.trends[1].type).toBe(WeatherChangeType.FM);
        expect(tafDated.trends[1].validity.start).toEqual(
          new Date("2022-01-16T00:00:00.000Z")
        );
        expect(tafDated.trends[1].validity.end).toBeUndefined();

        expect(tafDated.trends[2].type).toBe(WeatherChangeType.FM);
        expect(tafDated.trends[2].validity.start).toEqual(
          new Date("2022-01-16T03:00:00.000Z")
        );
        expect(tafDated.trends[2].validity.end).toBeUndefined();

        expect(tafDated.trends[3].type).toBe(WeatherChangeType.FM);
        expect(tafDated.trends[3].validity.start).toEqual(
          new Date("2022-01-16T17:00:00.000Z")
        );
        expect(tafDated.trends[3].validity.end).toBeUndefined();
      });
    });
  });

  describe("parseTAFAsForecast", () => {
    const rawTAF = `
TAF 
    AMD KMSN 152044Z 1521/1618 24009G16KT P6SM SCT100 
    TEMPO 1521/1523 BKN100 
   FM160000 27008KT P6SM SCT150 
   FM160300 30006KT P6SM FEW230 
   FM161700 30011G18KT P6SM BKN050
   `;

    test("parses", () => {
      expect(
        parseTAFAsForecast(rawTAF, { date: new Date("2022-01-01") }).forecast
      ).toHaveLength(5);
    });
  });
});
