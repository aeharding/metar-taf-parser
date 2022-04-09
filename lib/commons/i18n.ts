import messages from "locale/en.json";

// TODO - add other language support. EN hardcoded for now.

export default messages;

export function format(message: string, ...args: unknown[]): string {
  return message.replace(/{\d+}/g, (match) => {
    const index = +match.slice(1, -1);
    return args[index] !== undefined ? `${args[index]}` : "";
  });
}
