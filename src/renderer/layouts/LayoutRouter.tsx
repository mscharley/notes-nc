import { Box, CircularProgress } from '@mui/material';
import { lazy, Suspense } from 'react';
import { useAppSelector } from '~renderer/hooks/index.js';

const TwoColumnLayout = lazy(async () => import('./TwoColumnLayout.js'));

export const LayoutRouter: React.FC = () => {
	const layout = useAppSelector((s) => s.configuration.layout);
	const standby = (
		<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
			<CircularProgress />
		</Box>
	);

	switch (layout) {
		case 'two-column':
			return (
				<Suspense fallback={standby}>
					<TwoColumnLayout />
				</Suspense>
			);
		default:
			return standby;
	}
};
