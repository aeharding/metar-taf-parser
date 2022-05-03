import { determineReportIssuedDate } from "helpers/date";

describe("determineDate", () => {
  test("simple case", () => {
    const now = new Date("2022-01-15");

    expect(determineReportIssuedDate(now, 13, 0).toISOString()).toBe(
      "2022-01-13T00:00:00.000Z"
    );
  });

  test("backwards", () => {
    const now = new Date("2022-01-01");

    expect(determineReportIssuedDate(now, 29, 0).toISOString()).toBe(
      "2021-12-29T00:00:00.000Z"
    );
  });

  test("forwards", () => {
    const now = new Date("2022-01-29");

    expect(determineReportIssuedDate(now, 3, 0).toISOString()).toBe(
      "2022-02-03T00:00:00.000Z"
    );
  });

  test("with hours, minutes", () => {
    const now = new Date("2022-01-01");

    expect(determineReportIssuedDate(now, 29, 22, 45).toISOString()).toBe(
      "2021-12-29T22:45:00.000Z"
    );
  });
});
