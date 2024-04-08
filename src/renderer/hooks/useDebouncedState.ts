import { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

const ONE_SECOND = 1_000;

/**
 * Debounced state updates.
 *
 * @param initialState - Initial state
 * @param wait - Milliseconds to wait between updates
 *
 * @returns [state, setState, flushState]
 *
 * @see https://nodeployfriday.com/posts/react-debounce/
 */
export const useDebouncedState = <T>(
	initialState: T,
	wait = ONE_SECOND,
): [T, (value: T) => void, () => T | undefined] => {
	const [state, setState] = useState(initialState);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const throttleCb = useCallback(
		debounce((prop: T): T => {
			setState(prop);
			return prop;
		}, wait),
		[wait],
	);

	const setThrottledState = useCallback(
		(val: T): void => {
			throttleCb(val);
		},
		[throttleCb],
	);

	const flushState = useCallback(() => throttleCb.flush(), [throttleCb]);

	return [state, setThrottledState, flushState];
};
