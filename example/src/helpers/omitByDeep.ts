import _ from "lodash";

export function omitByDeep<V>(
  value: V,
  iteratee: (item: unknown) => boolean
): any {
  const cb = (v: V) => omitByDeep(v, iteratee);

  return _.isObject(value) && !_.isDate(value)
    ? _.isArray(value)
      ? _.map(value, cb)
      : _(value).omitBy(iteratee).mapValues(cb).value()
    : value;
}
