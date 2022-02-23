import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ErrorWrapperProps {}
export type ErrorWrapperState =
  | { hasError: false }
  | {
      hasError: true;
      error: Error;
    };

export class ErrorWrapper extends React.Component<ErrorWrapperProps, ErrorWrapperState> {
  public constructor(props: ErrorWrapperProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): ErrorWrapperState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    log.error(error, errorInfo);
  }

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert severity='error'>
          <AlertTitle>{this.state.error.message}</AlertTitle>
          <pre>{this.state.error.stack}</pre>
        </Alert>
      );
    }
    return this.props.children;
  }
}
