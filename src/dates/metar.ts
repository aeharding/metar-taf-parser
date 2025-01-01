import { IMetar } from "model/model";
import { determineReportDate } from "helpers/date";
import { RemarkType } from "command/remark";

export interface IMetarDated extends IMetar {
  issued: Date;
}

export function metarDatesHydrator(report: IMetar, date: Date): IMetarDated {
  return {
    ...report,
    remarks: report.remarks.map((remark) => {
      if (remark.type === RemarkType.NextForecastBy) {
        return {
          ...remark,
          date: determineReportDate(
            date,
            remark.day,
            remark.hour,
            remark.minute,
          ),
        };
      } else {
        return remark;
      }
    }),
    issued: determineReportDate(date, report.day, report.hour, report.minute),
  };
}
