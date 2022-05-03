import { pySplit } from "helpers/helpers";
import { _ } from "commons/i18n";
import { IBaseRemark, Remark, RemarkType } from "../remark";
import { Command } from "./Command";

type DefaultRemarkTypes =
  | RemarkType.AO1
  | RemarkType.AO2
  | RemarkType.PRESFR
  | RemarkType.PRESRR
  | RemarkType.TORNADO
  | RemarkType.FUNNELCLOUD
  | RemarkType.WATERSPOUT
  | RemarkType.VIRGA;

export interface IDefaultCommandRemark extends IBaseRemark {
  type: DefaultRemarkTypes;
}

export class DefaultCommand extends Command {
  canParse(): boolean {
    return true;
  }

  execute(code: string, remark: Remark[]): [string, Remark[]] {
    const rmkSplit = pySplit(code, " ", 1);
    const rem = _(`Remark.${rmkSplit[0]}` as any, this.locale);

    if (RemarkType[rmkSplit[0] as RemarkType]) {
      remark.push({
        type: rmkSplit[0] as RemarkType,
        description: rem,
        raw: rmkSplit[0],
      } as IDefaultCommandRemark);
    } else {
      const lastRemark = remark[remark.length - 1];
      if (lastRemark?.type === RemarkType.Unknown) {
        // Merge with last unknown value
        lastRemark.raw = `${lastRemark.raw} ${rmkSplit[0]}`;
      } else {
        remark.push({
          type: RemarkType.Unknown,
          raw: rmkSplit[0],
        });
      }
    }

    return [rmkSplit.length === 1 ? "" : rmkSplit[1], remark];
  }
}
