import type { CustomScheme, Protocol } from 'electron/main';

export interface CustomProtocolProvider {
	readonly privilegedSchemes: CustomScheme[];
	readonly registerProtocols: (protocol: Protocol) => void;
}
