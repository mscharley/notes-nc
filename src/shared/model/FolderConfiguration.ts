/* eslint-disable @typescript-eslint/no-type-alias */

export interface FileDescription {
  name: string;
  displayName: string;
  url: string;
}
export type CategoryDescription = {
  name: string;
  path: string;
  files: FileDescription[];
};
export interface FolderDescription {
  uuid: string;
  name: string;
  localPath: string;
  displayPath: string;
  baseUrl: string;
  categories: CategoryDescription[];
}
/**
 * An list of FolderDescriptions, indexed by name.
 */
export type FolderConfiguration = Record<string, FolderDescription>;
