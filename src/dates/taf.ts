import { WeatherChangeType } from "model/enum";
import {
  IAbstractTrend,
  IFMValidity,
  ITAF,
  IBaseTAFTrend,
  IValidity,
  ITemperatureDated,
} from "model/model";
import { determineReportDate } from "helpers/date";
import { Remark, RemarkDated, RemarkType } from "command/remark";

export type TAFTrendDated = IAbstractTrend &
  IBaseTAFTrend & {
    validity: IBaseTAFTrend["validity"] & {
      start: Date;
      end?: Date;
    };
    remarks: RemarkDated[];
  } & (
    | {
        type: WeatherChangeType.FM;
        validity: IFMValidity & {
          start: Date;
        };
      }
    | {
        type: WeatherChangeType;
        validity: IValidity & {
          start: Date;
          end: Date;
        };
      }
  );

export interface ITAFDated extends ITAF {
  issued: Date;

  validity: ITAF["validity"] & {
    start: Date;
    end: Date;
  };

  minTemperature?: ITemperatureDated;
  maxTemperature?: ITemperatureDated;

  trends: TAFTrendDated[];
  remarks: RemarkDated[];
}

function remarksDatesHydrator(remarks: Remark[], date: Date): RemarkDated[] {
  return remarks.map((remark) => {
    if (remark.type === RemarkType.NextForecastBy) {
      return {
        ...remark,
        date: determineReportDate(date, remark.day, remark.hour, remark.minute),
      };
    }
    return remark;
  });
}

export function tafDatesHydrator(report: ITAF, date: Date): ITAFDated {
  const issued = determineReportDate(
    date,
    report.day,
    report.hour,
    report.minute,
  );

  return {
    ...report,
    issued,
    validity: {
      ...report.validity,
      start: determineReportDate(
        issued,
        report.validity.startDay,
        report.validity.startHour,
      ),
      end: determineReportDate(
        issued,
        report.validity.endDay,
        report.validity.endHour,
      ),
    },
    minTemperature: report.minTemperature
      ? {
          ...report.minTemperature,
          date: determineReportDate(
            issued,
            report.minTemperature.day,
            report.minTemperature.hour,
          ),
        }
      : undefined,
    maxTemperature: report.maxTemperature
      ? {
          ...report.maxTemperature,
          date: determineReportDate(
            issued,
            report.maxTemperature.day,
            report.maxTemperature.hour,
          ),
        }
      : undefined,
    trends: report.trends.map(
      (trend) =>
        ({
          ...trend,
          remarks: remarksDatesHydrator(trend.remarks, issued),
          validity: (() => {
            switch (trend.type) {
              case WeatherChangeType.FM:
                return {
                  ...trend.validity,
                  start: determineReportDate(
                    issued,
                    trend.validity.startDay,
                    trend.validity.startHour,
                    trend.validity.startMinutes,
                  ),
                };
              default:
                return {
                  ...trend.validity,
                  start: determineReportDate(
                    issued,
                    trend.validity.startDay,
                    trend.validity.startHour,
                  ),
                  end: determineReportDate(
                    issued,
                    trend.validity.endDay,
                    trend.validity.endHour,
                  ),
                };
            }
          })(),
        }) as TAFTrendDated,
    ),
    remarks: remarksDatesHydrator(report.remarks, issued),
  };
}
