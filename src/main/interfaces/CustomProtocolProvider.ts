import type { CustomScheme } from 'electron/main';

export interface CustomProtocolProvider {
  readonly privilegedSchemes: CustomScheme[];
  readonly registerProtocols: () => void;
}
