export interface AboutDetails {
  electronVersion: string;
  version: string;
  isDevBuild: boolean;

  updateExists: boolean;
  updateDownloaded: boolean;
  updateVersion?: string;

  osName: string;
  osVersion: string;
}
