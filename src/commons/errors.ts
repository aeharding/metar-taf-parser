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
    super(
      typeof cause === "string"
        ? `Invalid weather string: ${cause}`
        : "Invalid weather string",
    );
    Object.setPrototypeOf(this, new.target.prototype);

    if (typeof cause !== "string") this.cause = cause;
  }
}

/**
 * Thrown when an input contains data elements that are recognized but
 * intentionally not supported.
 */
export class PartialWeatherStatementError extends InvalidWeatherStatementError {
  name = "PartialWeatherStatementError";
  part: number;
  total: number;

  constructor(partialMessage: string, part: number, total: number) {
    super(
      `Input is partial TAF (${partialMessage}), see: https://github.com/aeharding/metar-taf-parser/issues/68`,
    );
    Object.setPrototypeOf(this, new.target.prototype);

    this.part = part;
    this.total = total;
  }
}

/**
 * Thrown when command marked as canParse, but couldn't parse when
 * executing (for example, an invalid CloudQuantity)
 */
export class CommandExecutionError extends ParseError {
  name = "CommandExecutionError";

  constructor(message: string) {
    super(message);
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
