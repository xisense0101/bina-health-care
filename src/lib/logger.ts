/* Minimal logger that is silent in production.
   Use exported functions (log, info, warn, error) instead of console.*
*/

const isProd = typeof process !== 'undefined'
  ? process.env.NODE_ENV === 'production'
  : typeof import.meta !== 'undefined' && !!(import.meta as any).env?.PROD;

export function log(...args: any[]) {
  if (!isProd) console.log(...args);
}
export function info(...args: any[]) {
  if (!isProd) console.info(...args);
}
export function warn(...args: any[]) {
  if (!isProd) console.warn(...args);
}
export function error(...args: any[]) {
  if (!isProd) console.error(...args);
}

export default { log, info, warn, error };