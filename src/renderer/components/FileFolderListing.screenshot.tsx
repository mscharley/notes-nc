import type { CategoryDescription } from '~shared/model';
import { FileFolderListing } from './FileFolderListing';

const categories: CategoryDescription[] = [
  {
    name: 'Test category',
    path: '/Test category',
    files: [
      {
        name: 'File 1',
        url: 'editor://deadbeef/',
      },
    ],
  },
  { name: 'Empty category', path: '/Empty category', files: [] },
];

export const BasicFileFolderListing = () => (
  <FileFolderListing name='Hello world' categories={categories} showEmpty={true} />
);

export const HideEmptyFileFolderListing = () => (
  <FileFolderListing name='Hello world' categories={categories} showEmpty={false} />
);
