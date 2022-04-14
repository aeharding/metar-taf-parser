import { CommandExecutionError } from "commons/errors";

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

/**
 * Access nested object properties by string path
 *
 * https://stackoverflow.com/a/22129960
 */
export function resolve(
  obj: any,
  path: string | string[],
  separator = "."
): unknown {
  const properties = Array.isArray(path) ? path : path.split(separator);

  return properties.reduce((prev, curr) => prev?.[curr], obj);
}

/**
 * For safely casting input values
 * @param input String that is expected to be in the snum
 * @param enumExpected The enum to cast the input value to
 * @throws RemarkExecutionError when input is not a key of enum
 */
export function as<T extends Record<string, unknown>>(
  input: string,
  enumExpected: T
): T[keyof T] {
  if (!Object.values(enumExpected).includes(input))
    throw new CommandExecutionError(
      `${input} not found in ${Object.values(enumExpected)}`
    );

  return input as T[keyof T];
}
