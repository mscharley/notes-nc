/* eslint-disable @typescript-eslint/no-type-alias */

import type { FileDescription } from './FileDescription';

export type CategoryListing = Record<string, FileDescription[]>;
export type FileListing = Record<string, CategoryListing>;
