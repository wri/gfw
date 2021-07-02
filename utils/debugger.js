/**
 * When NEXT_PUBLIC_DEBUG is enabled, you can add debug messages when needed.
 * Will be ignored if this feature is disabled.
 *
 * @param {string} message - What message do you want to log?
 * @param {unknown} data - Payload you want to debug
 * @param {string} color - Highlight your message with a color, red is default
 * @return {void}
 *
 * @example
 *
 *    debug('function returning', { hello: 'world' }, 'green');
 */
export function debug(message, data, color = 'red') {
  if (process?.env?.NEXT_PUBLIC_DEBUG) {
    console.log(`%c ${message}`, `color: ${color}`, data); // eslint-disable-line
  }
}
