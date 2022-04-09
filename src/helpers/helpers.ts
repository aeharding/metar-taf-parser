/**
 * Split behaving similar to Python's implementation
 */
export function pySplit(string: string, separator: string, n?: number) {
  let split = string.split(separator);

  // Note: Python implementation will automatically trim empty values if
  // separator is undefined. Since this function is kinda meh, we'll just do it
  // for any spaces (pretty close to their implementation, since a space is the
  // default character to split on)
  //
  // https://docs.python.org/3/library/stdtypes.html?highlight=split#str.split
  if (separator === " ") split = split.filter((n) => n);

  if (n == null || split.length <= n) return split;

  const out = split.slice(0, n);
  out.push(split.slice(n).join(separator));

  return out;
}
