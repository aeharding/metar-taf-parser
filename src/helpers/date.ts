/**
 *
 * @param date Ideally the date the report was issued. However, any date within
 * ~14 days of the report will work.
 * @param day Day of the month (from the report)
 * @param hour Hour (from the report)
 * @param minute Minute (from the report)
 * @returns
 */
export function determineReportIssuedDate(
  date: Date,
  day?: number,
  hour?: number,
  minute?: number
): Date {
  // Some TAF reports do not include a delivery time
  if (day == null || hour == null) return date;

  const months = [
    setDateComponents(addMonthsUTC(date, -1), day, hour, minute),
    setDateComponents(new Date(date), day, hour, minute),
    setDateComponents(addMonthsUTC(date, 1), day, hour, minute),
  ];

  return months
    .map((d) => ({
      date: d,
      difference: Math.abs(d.getTime() - date.getTime()),
    }))
    .sort((a, b) => a.difference - b.difference)[0].date;
}

export function getReportDate(
  issued: Date,
  day: number,
  hour: number,
  minute = 0
): Date {
  let date = new Date(issued);

  if (day < date.getUTCDate()) {
    date = addMonthsUTC(date, 1);
  }

  date.setUTCDate(day);
  date.setUTCHours(hour);
  if (minute != null) date.setUTCMinutes(minute);

  return date;
}

function setDateComponents(
  date: Date,
  day: number,
  hour: number,
  minute?: number
): Date {
  date.setUTCDate(day);
  date.setUTCHours(hour);
  if (minute != null) date.setUTCMinutes(minute);

  return date;
}

function addMonthsUTC(date: Date, count: number) {
  if (date && count) {
    let m,
      d = (date = new Date(+date)).getUTCDate();

    date.setUTCMonth(date.getUTCMonth() + count, 1);
    m = date.getUTCMonth();
    date.setUTCDate(d);
    if (date.getUTCMonth() !== m) date.setUTCDate(0);
  }
  return date;
}
