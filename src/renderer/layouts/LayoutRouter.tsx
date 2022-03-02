import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { TwoColumnLayout } from './TwoColumnLayout';
import { useAppSelector } from '~renderer/hooks';

export const LayoutRouter: React.FC = () => {
  const layout = useAppSelector((s) => s.configuration.layout);

  switch (layout) {
    case 'two-column':
      return <TwoColumnLayout />;
    default:
      return (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      );
  }
};
