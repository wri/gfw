export function debug(message, data, color = 'red') {
  if (process?.env?.NEXT_PUBLIC_DEBUG) {
    console.log(`%c ${message}`, `color: ${color}`, data); // eslint-disable-line
  }
}
