import { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '~renderer/hooks';

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
