import { RemarkCommandSupplier } from "../../src/command/remark";
import { WindShiftFropaCommand } from "../../src/command/remark/WindShiftFropaCommand";
import en from "../../src/locale/en";
import { DefaultCommand } from "../../src/command/remark/DefaultCommand";

describe("RemarkCommandSupplier", () => {
  const supplier = new RemarkCommandSupplier(en);

  test("gets WindShiftFropaCommand command", () => {
    const code = "WSHFT 2241 FROPA";

    expect(supplier.get(code)).toBeInstanceOf(WindShiftFropaCommand);
  });

  test("returns DefaultCommand if unknown", () => {
    const code = "bogus";

    expect(supplier.get(code)).toBeInstanceOf(DefaultCommand);
  });
});
