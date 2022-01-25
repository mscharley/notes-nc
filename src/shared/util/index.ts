/**
 * Helper to delay execution of a promise for a given amount of time.
 *
 * @param milliseconds How long to wait for.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async
export const sleep = (milliseconds: number): Promise<void> =>
  new Promise((r) => setTimeout(r, milliseconds));

/**
 * Tiny helper for a function that does nothing, when required.
 */
export const noop = (): void => {
  /* noop */
};
