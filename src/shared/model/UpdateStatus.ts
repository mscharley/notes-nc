export interface UpdateStatus {
	canCheckForUpdates: boolean;
	checkingForUpdate: boolean;
	updateExists: boolean;
	updateDownloaded: boolean;
	updateVersion?: string;
}
