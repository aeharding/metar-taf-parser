import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { DefaultCommand } from "command/remark/DefaultCommand";

describe("DefaultCommand", () => {
  const command = new DefaultCommand(en);

  (() => {
    const code = "AO1";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.AO1,
            description:
              "automated stations without a precipitation discriminator",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "AO2";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.AO2,
            description: "automated station with a precipitation discriminator",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "PRESFR";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PRESFR,
            description: "pressure falling rapidly",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "PRESRR";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PRESRR,
            description: "pressure rising rapidly",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "TORNADO";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.TORNADO,
            description: "tornado",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "TORNADO";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.TORNADO,
            description: "tornado",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "FUNNELCLOUD";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.FUNNELCLOUD,
            description: "funnel cloud",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "WATERSPOUT";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.WATERSPOUT,
            description: "waterspout",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "VIRGA";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.VIRGA,
            description: "virga",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "BOGUS";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.Unknown,
            raw: code,
          },
        ]);
      });
    });
  })();
});
