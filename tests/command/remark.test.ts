import { RemarkCommandSupplier } from "command/remark";
import { WindShiftFropaCommand } from "command/remark/WindShiftFropaCommand";
import en from "locale/en";
import { DefaultCommand } from "command/remark/DefaultCommand";

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
