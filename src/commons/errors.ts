export abstract class ParseError extends Error {
  name = "ParseError";

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidWeatherStatementError extends ParseError {
  name = "InvalidWeatherStatementError";
  cause?: unknown;

  constructor(cause?: unknown) {
    super(`Invalid weather string.`);
    Object.setPrototypeOf(this, new.target.prototype);

    this.cause = cause;
  }
}

export class TranslationError extends ParseError {
  name = "TranslationError";

  constructor(missingLocale: string) {
    super(`Missing translation "${missingLocale}"`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Should never occur
 */
export class UnexpectedParseError extends ParseError {
  name = "UnexpectedParseError";

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
