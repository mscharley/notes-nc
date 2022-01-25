import { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

/**
 * Debounced state updates.
 *
 * @param initialState - Initial state
 * @param wait - Milliseconds to wait between updates
 *
 * @see https://nodeployfriday.com/posts/react-debounce/
 */
export const useDebouncedState = <T>(
  initialState: T,
  wait = 1_000,
): [T, (value: T) => void] => {
  const [state, setState] = useState(initialState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttleCb = useCallback(
    debounce((prop: T): void => {
      setState(prop);
    }, wait),
    [wait],
  );

  const setThrottledState = (val: T): void => {
    throttleCb(val);
  };

  return [state, setThrottledState];
};
