import { CloudCommand, WindCommand } from "command/common";
import { CloudQuantity, CloudType } from "model/enum";

describe("CloudCommand", () => {
  const command = new CloudCommand();

  (() => {
    const code = "SKC";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const cloud = command.parse(code);

        expect(cloud).toBeDefined();
        expect(cloud?.quantity).toBe(CloudQuantity.SKC);
        expect(cloud?.height).toBeUndefined();
        expect(cloud?.type).toBeUndefined();
      });
    });
  })();

  (() => {
    const code = "SCT016";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const cloud = command.parse(code);

        expect(cloud).toBeDefined();
        expect(cloud?.quantity).toBe(CloudQuantity.SCT);
        expect(cloud?.height).toBe(1600);
        expect(cloud?.type).toBeUndefined();
      });
    });
  })();

  (() => {
    // With type
    const code = "SCT026CB";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const cloud = command.parse(code);

        expect(cloud).toBeDefined();
        expect(cloud?.quantity).toBe(CloudQuantity.SCT);
        expect(cloud?.height).toBe(2600);
        expect(cloud?.type).toBe(CloudType.CB);
      });
    });
  })();

  (() => {
    // Unknown type
    const code = "SCT026///";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const cloud = command.parse(code);

        expect(cloud).toBeDefined();
        expect(cloud?.quantity).toBe(CloudQuantity.SCT);
        expect(cloud?.height).toBe(2600);
        expect(cloud?.type).toBeUndefined();
      });
    });
  })();

  (() => {
    // Unknown height and unknown type
    const code = "SCT//////";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const cloud = command.parse(code);

        expect(cloud).toBeDefined();
        expect(cloud?.quantity).toBe(CloudQuantity.SCT);
        expect(cloud?.height).toBeUndefined();
        expect(cloud?.type).toBeUndefined();
      });
    });
  })();

  (() => {
    // Unknown type with secondary should not be valid
    const code = "SCT026////CU";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(false);
      });
    });
  })();

  (() => {
    // With multiple cloud types
    // (Very uncommon to have two types - seen at VOTR)
    const code = "FEW025TCU/CB";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const cloud = command.parse(code);

        expect(cloud).toBeDefined();
        expect(cloud?.quantity).toBe(CloudQuantity.FEW);
        expect(cloud?.height).toBe(2500);
        expect(cloud?.type).toBe(CloudType.TCU);
        expect(cloud?.secondaryType).toBe(CloudType.CB);
      });
    });
  })();

  (() => {
    // With invalid quantity
    const code = "BBB025";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        expect(() => command.parse(code)).toThrow();
      });
    });
  })();

  (() => {
    // With invalid type
    const code = "FEW025AAA";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        expect(() => command.parse(code)).toThrow();
      });
    });
  })();
});

describe("WindCommand", () => {
  const command = new WindCommand();

  (() => {
    const code = "34008KT";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const wind = command.parseWind(code);

        expect(wind.direction).toBe("NNW");
        expect(wind.degrees).toBe(340);
        expect(wind.speed).toBe(8);
        expect(wind.gust).toBeUndefined();
        expect(wind.unit).toBe("KT");
      });
    });
  })();

  (() => {
    const code = "12017G20KT";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const wind = command.parseWind(code);

        expect(wind.direction).toBe("ESE");
        expect(wind.degrees).toBe(120);
        expect(wind.speed).toBe(17);
        expect(wind.gust).toBe(20);
        expect(wind.unit).toBe("KT");
      });
    });
  })();

  (() => {
    const code = "VRB08KT";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        const wind = command.parseWind(code);

        expect(wind.direction).toBe("VRB");
        expect(wind.speed).toBe(8);
        expect(wind.degrees).toBeUndefined();
      });
    });
  })();
});
