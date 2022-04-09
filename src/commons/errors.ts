export class ParseError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidWeatherStatementError extends ParseError {
  constructor(missing: string) {
    super(`Invalid weather string. Missing: ${missing}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TranslationError extends ParseError {
  constructor(missingLocale: string) {
    super(`Missing locale "${missingLocale}"`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Should never occur
 */
export class UnexpectedParseError extends ParseError {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
