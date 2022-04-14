import { parseMetar } from "index";

describe("public API", () => {
  describe("parseMetar", () => {
    test("parses", () => {
      expect(parseMetar("LFPG 161430Z 24015G25KT 5000 1100w").station).toBe(
        "LFPG"
      );
    });
  });
});
