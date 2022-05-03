import { Locale } from "../../commons/i18n";
import { Remark } from "../remark";

export abstract class Command {
  constructor(protected locale: Locale) {}

  abstract canParse(code: string): boolean;

  abstract execute(code: string, remark: Remark[]): [string, Remark[]];
}
