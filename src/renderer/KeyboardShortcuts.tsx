import { setActiveOverlay } from '~renderer/redux/index.js';
import { useAppDispatch } from '~renderer/hooks/index.js';
import { useEffect } from 'react';

export const KeyboardShortcuts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const handler = (ev: KeyboardEvent): void => {
			if (ev.ctrlKey && ev.key === ',') {
				ev.preventDefault();
				dispatch(setActiveOverlay('configuration'));
			}
		};

		document.addEventListener('keypress', handler, { capture: true });

		return (): void => {
			document.removeEventListener('keypress', handler, { capture: true });
		};
	}, [dispatch]);

	return <>{children}</>;
};
