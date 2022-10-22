import { WeatherChangeType } from "model/enum";
import {
  IAbstractTrend,
  IFMValidity,
  ITAF,
  IBaseTAFTrend,
  IValidity,
  ITemperatureDated,
} from "model/model";
import { determineReportIssuedDate, getReportDate } from "helpers/date";

export type TAFTrendDated = IAbstractTrend &
  IBaseTAFTrend & {
    validity: IBaseTAFTrend["validity"] & {
      start: Date;
      end?: Date;
    };
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
}

export function tafDatesHydrator(report: ITAF, date: Date): ITAFDated {
  const issued = determineReportIssuedDate(
    date,
    report.day,
    report.hour,
    report.minute
  );

  return {
    ...report,
    issued,
    validity: {
      ...report.validity,
      start: getReportDate(
        issued,
        report.validity.startDay,
        report.validity.startHour
      ),
      end: getReportDate(
        issued,
        report.validity.endDay,
        report.validity.endHour
      ),
    },
    minTemperature: report.minTemperature
      ? {
          ...report.minTemperature,
          date: getReportDate(
            issued,
            report.minTemperature.day,
            report.minTemperature.hour
          ),
        }
      : undefined,
    maxTemperature: report.maxTemperature
      ? {
          ...report.maxTemperature,
          date: getReportDate(
            issued,
            report.maxTemperature.day,
            report.maxTemperature.hour
          ),
        }
      : undefined,
    trends: report.trends.map(
      (trend) =>
        ({
          ...trend,
          validity: (() => {
            switch (trend.type) {
              case WeatherChangeType.FM:
                return {
                  ...trend.validity,
                  start: getReportDate(
                    issued,
                    trend.validity.startDay,
                    trend.validity.startHour,
                    trend.validity.startMinutes
                  ),
                };
              default:
                return {
                  ...trend.validity,
                  start: getReportDate(
                    issued,
                    trend.validity.startDay,
                    trend.validity.startHour
                  ),
                  end: getReportDate(
                    issued,
                    trend.validity.endDay,
                    trend.validity.endHour
                  ),
                };
            }
          })(),
        } as TAFTrendDated)
    ),
  };
}
