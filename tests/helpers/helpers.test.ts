import { pySplit } from "helpers/helpers";

describe("pySplit", () => {
  it("no limit", () => {
    expect(pySplit("1,2,3,4", ",")).toStrictEqual(["1", "2", "3", "4"]);
  });

  it("limit = 0", () => {
    expect(pySplit("1,2,3,4", ",", 0)).toStrictEqual(["1,2,3,4"]);
  });

  it("limit = 1", () => {
    expect(pySplit("1,2,3,4", ",", 1)).toStrictEqual(["1", "2,3,4"]);
  });

  it("limit = 10", () => {
    expect(pySplit("1,2,3,4", ",", 10)).toStrictEqual(["1", "2", "3", "4"]);
  });
});
