export interface AboutDetails {
  electronVersion: string;
  version: string;
  isDevBuild: boolean;

  updateExists: boolean;
  updateVersion?: string;

  osName: string;
  osVersion: string;
}
