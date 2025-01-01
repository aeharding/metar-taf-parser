import {
  parseMetar,
  parseTAF,
  parseTAFAsForecast,
  WeatherChangeType,
} from "index";
import {INextForecastByRemarkDated} from "command/remark/NextForecastByCommand";

describe("public API", () => {
  describe("parseMetar", () => {
    test("parses", () => {
      expect(parseMetar("LFPG 161430Z 24015G25KT 5000 1100w").station).toBe(
        "LFPG",
      );
    });

    test("parses with date", () => {
      expect(
        parseMetar("LFPG 161430Z 24015G25KT 5000 1100w", {
          issued: new Date("2022-01-16"),
        }).issued,
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
            issued: new Date("2022-01-16"),
          }).issued,
        ).toEqual(new Date("2022-01-15T20:44:00.000Z"));
      });

      test("sets validity", () => {
        const tafDated = parseTAF(rawTAF, {
          issued: new Date("2022-01-16"),
        });

        expect(tafDated.validity.start).toEqual(
          new Date("2022-01-15T21:00:00.000Z"),
        );
        expect(tafDated.validity.end).toEqual(
          new Date("2022-01-16T18:00:00.000Z"),
        );
      });

      test("sets next forecasted by remark date", () => {
        const taf = parseTAF(
          `
    TAF CYVR 152340Z 1600/1706 29015KT P6SM FEW015 FM162200 28010KT P6SM SKC RMK NXT FCST BY 160300Z
        `,
          { issued: new Date("2022-10-22") },
        );
        expect(taf.trends[0]).toBeDefined();
        expect(taf.trends[0].remarks[0]).toBeDefined();
        expect((taf.trends[0].remarks[0] as INextForecastByRemarkDated).date).toEqual(
          new Date("2022-10-16T03:00:00.000Z"),
        );
      })

      test("should set maxTemperature, minTemperature with dates", () => {
        const taf = parseTAF(
          `
    TAF AMD SBPJ 221450Z 2218/2318 TN25/2309Z TX34/2316Z
        `,
          { issued: new Date("2022-10-22") },
        );

        expect(taf.maxTemperature?.temperature).toBe(34);
        expect(taf.maxTemperature?.date).toEqual(
          new Date("2022-10-23T16:00:00.000Z"),
        );
        expect(taf.minTemperature?.temperature).toBe(25);
        expect(taf.minTemperature?.date).toEqual(
          new Date("2022-10-23T09:00:00.000Z"),
        );
      });

      test("sets trend validity", () => {
        const tafDated = parseTAF(rawTAF, {
          issued: new Date("2022-01-16"),
        });

        expect(tafDated.trends).toHaveLength(4);
        expect(tafDated.trends[0].type).toBe(WeatherChangeType.TEMPO);
        expect(tafDated.trends[0].validity.start).toEqual(
          new Date("2022-01-15T21:00:00.000Z"),
        );
        expect(tafDated.trends[0].validity.end).toEqual(
          new Date("2022-01-15T23:00:00.000Z"),
        );

        expect(tafDated.trends[1].type).toBe(WeatherChangeType.FM);
        expect(tafDated.trends[1].validity.start).toEqual(
          new Date("2022-01-16T00:00:00.000Z"),
        );
        expect(tafDated.trends[1].validity.end).toBeUndefined();

        expect(tafDated.trends[2].type).toBe(WeatherChangeType.FM);
        expect(tafDated.trends[2].validity.start).toEqual(
          new Date("2022-01-16T03:00:00.000Z"),
        );
        expect(tafDated.trends[2].validity.end).toBeUndefined();

        expect(tafDated.trends[3].type).toBe(WeatherChangeType.FM);
        expect(tafDated.trends[3].validity.start).toEqual(
          new Date("2022-01-16T17:00:00.000Z"),
        );
        expect(tafDated.trends[3].validity.end).toBeUndefined();
      });
    });

    describe("without delivery time, but with passed in issued date", () => {
      const taf = parseTAF(
        "TAF KNBC 1215/1315 27010KT 9999 SCT010 BKN080 QNH2992INS TEMPO 1218/1300 25010G20KT 4800 TSRA BR BKN010CB BECMG 1300/1302 30015KT 6000 SHRA BR BKN015 QNH2998INS FM130430 04012KT 9999 NSW SCT020 BKN050 QNH2991INS T30/1219Z T22/1309Z",
        {
          issued: new Date("2022-08-12T14:57:00Z"),
        },
      );

      test("has issued date", () => {
        expect(taf.issued).toEqual(new Date("2022-08-12T14:57:00Z"));
        expect(taf.day).toBeUndefined();
        expect(taf.hour).toBeUndefined();
        expect(taf.minute).toBeUndefined();
      });
    });

    test("parses station ident beginning with 'FM'", () => {
      const taf = parseTAF(
        [
          "TAF FMMI 082300Z 0900/1006 16006KT 9999 FEW017 BKN020 PROB30",
          "TEMPO 0908/0916 4500 RADZ",
          "BECMG 0909/0911 10010KT",
          "BECMG 0918/0920 16006KT",
        ].join("\n"),
      );
      expect(taf.station).toBe("FMMI");
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
        parseTAFAsForecast(rawTAF, { issued: new Date("2022-01-01") }).forecast,
      ).toHaveLength(5);
    });
  });
});
