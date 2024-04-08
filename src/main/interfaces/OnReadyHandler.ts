export interface OnReadyHandler {
	readonly onAppReady: () => Promise<void> | void;
}
