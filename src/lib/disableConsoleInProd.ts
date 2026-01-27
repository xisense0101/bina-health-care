// Disable all console output in production (global override).
// This runs in the browser when imported early (e.g., in main.tsx)

const isProd = typeof process !== 'undefined'
  ? process.env.NODE_ENV === 'production'
  : typeof import.meta !== 'undefined' && !!(import.meta as any).env?.PROD;

if (isProd && typeof window !== 'undefined' && typeof console !== 'undefined') {
  const noop = () => {};
  // common console methods
  // @ts-ignore
  console.log = noop;
  // @ts-ignore
  console.info = noop;
  // @ts-ignore
  console.warn = noop;
  // @ts-ignore
  console.error = noop;
  // @ts-ignore
  console.debug = noop;
  // @ts-ignore
  console.trace = noop;
  // Optional extras
  // @ts-ignore
  console.table = noop;
}

export {};
