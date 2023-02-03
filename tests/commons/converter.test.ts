import * as converter from "commons/converter";
import { DistanceUnit, ValueIndicator } from "model/enum";

describe("degreesToCardinal", () => {
  test("VRB", () => {
    expect(converter.degreesToCardinal("VRB")).toBe("VRB");
  });

  const expected: [string, string][] = [
    ["80", "E"],
    ["30", "NNE"],
    ["200", "SSW"],
    ["280", "W"],
    ["300", "WNW"],
    ["130", "SE"],
    ["230", "SW"],
    ["2", "N"],
    ["345", "NNW"],
    ["anything", "VRB"],
  ];

  expected.forEach(([input, expected]) => {
    test(input, () => {
      expect(converter.degreesToCardinal(input)).toBe(expected);
    });
  });
});

describe("convertVisibility", () => {
  test("convert visibility 10km", () => {
    expect(converter.convertVisibility("9999")).toEqual({
      indicator: ValueIndicator.GreaterThan,
      value: 9999,
      unit: DistanceUnit.Meters,
    });
  });

  test("specific", () => {
    expect(converter.convertVisibility("04512")).toEqual({
      value: 4512,
      unit: DistanceUnit.Meters,
    });
  });
});

describe("convertNauticalVisibility", () => {
  test("convert visibility 1/2", () => {
    expect(converter.convertNauticalMilesVisibility("1/2SM")).toEqual({
      value: 0.5,
      unit: DistanceUnit.StatuteMiles,
    });

    expect(converter.convertNauticalMilesVisibility("1 1/2SM")).toEqual({
      value: 1.5,
      unit: DistanceUnit.StatuteMiles,
    });

    expect(converter.convertNauticalMilesVisibility("M1/2SM")).toEqual({
      indicator: ValueIndicator.LessThan,
      value: 0.5,
      unit: DistanceUnit.StatuteMiles,
    });

    expect(converter.convertNauticalMilesVisibility("P6SM")).toEqual({
      indicator: ValueIndicator.GreaterThan,
      value: 6,
      unit: DistanceUnit.StatuteMiles,
    });
  });
});

describe("convertTemperature", () => {
  test("minus", () => {
    expect(converter.convertTemperature("M12")).toBe(-12);
  });

  test("positive", () => {
    expect(converter.convertTemperature("05")).toBe(5);
  });
});

describe("convertTemperatureRemarks", () => {
  test("positive", () => {
    expect(converter.convertTemperatureRemarks("0", "142")).toBe(14.2);
  });

  test("negative", () => {
    expect(converter.convertTemperatureRemarks("1", "021")).toBe(-2.1);
  });
});

test("convertPrecipitationAmount", () => {
  expect(converter.convertPrecipitationAmount("0217")).toBe(2.17);
});

describe("convertFractionalAmount", () => {
  test("whole", () => {
    expect(converter.convertFractionalAmount("12")).toBe(12);
  });

  test("whole + fraction", () => {
    expect(converter.convertFractionalAmount("3 1/4")).toBe(3.25);
  });

  test("fraction", () => {
    expect(converter.convertFractionalAmount("1/4")).toBe(0.25);
  });
});
