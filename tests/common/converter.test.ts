import * as converter from "commons/converter";

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
    expect(converter.convertVisibility("9999")).toBe("> 10km");
  });

  test("specific", () => {
    expect(converter.convertVisibility("4512")).toBe("4512m");
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

test("convertInchesMercuryToPascal", () => {
  expect(converter.convertInchesMercuryToPascal(29.92)).toBeCloseTo(1013.2, 1);
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
