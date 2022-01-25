import type { CustomScheme, Session } from 'electron/main';

export interface CustomProtocolProvider {
  readonly privilegedSchemes: CustomScheme[];
  readonly registerProtocols: (session: Session) => void;
}
