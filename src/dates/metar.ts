import { IMetar } from "model/model";
import { determineReportDate } from "helpers/date";

export interface IMetarDated extends IMetar {
  issued: Date;
}

export function metarDatesHydrator(report: IMetar, date: Date): IMetarDated {
  return {
    ...report,
    issued: determineReportDate(date, report.day, report.hour, report.minute),
  };
}
