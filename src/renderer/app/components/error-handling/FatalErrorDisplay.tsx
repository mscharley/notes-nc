import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useAppSelector } from '../../hooks';

export const FatalErrorDisplay: React.FC = ({ children }) => {
  const error = useAppSelector((state) => state.fatalError);

  if (error != null) {
    return (
      <Alert severity='error'>
        <AlertTitle>{error.message}</AlertTitle>
        <pre>{error.stack}</pre>
      </Alert>
    );
  } else {
    return <>{children}</>;
  }
};
