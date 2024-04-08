/**
 * Helper to delay execution of a promise for a given amount of time.
 *
 * @param milliseconds How long to wait for.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async
export const sleep = (milliseconds: number): Promise<void> => new Promise((r) => setTimeout(r, milliseconds));

/**
 * Tiny helper for a function that does nothing, when required.
 */
export const noop = (): void => {
	/* noop */
};

/**
 * Helper to remove any readonly tags in a type.
 *
 * This should only be used for tests - it is dangerous in application code.
 */
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};
