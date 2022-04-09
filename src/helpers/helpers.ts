/**
 * Split behaving similar to Python's implementation
 */
export function pySplit(string: string, separator: string, n?: number) {
  const split = string.split(separator);

  if (n == null || split.length <= n) return split;

  const out = split.slice(0, n);
  out.push(split.slice(n).join(separator));

  return out;
}

export function findAll(regex: RegExp, str: string): string[] {
  const hits: string[] = [];
  // Iterate hits
  let match = null;
  do {
    match = regex.exec(str);
    if (match) {
      hits.push(match[0]);
    }
  } while (match);

  return hits;
}
