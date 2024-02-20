import en from "locale/en";
import { resolve } from "helpers/helpers";

export default en;

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Locale = DeepPartial<typeof en>;

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

export function _(
  path: Join<PathsToStringProps<typeof en>, ".">,
  lang: Locale,
): string | undefined {
  const translation = resolve(lang, path);

  if (!translation || typeof translation !== "string") return undefined;

  return translation;
}

export function format(
  message: string | undefined,
  ...args: unknown[]
): string | undefined {
  if (!message) return;

  // All arguments must be defined, otherwise nothing is returned
  for (const arg of args) {
    if (arg === undefined) return;
  }

  return message.replace(/{\d+}/g, (match) => {
    const index = +match.slice(1, -1);
    return `${args[index]}`;
  });
}
