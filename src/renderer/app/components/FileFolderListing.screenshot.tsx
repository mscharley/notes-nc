import { FileFolderListing } from './FileFolderListing';

const categories = {
  'Test category': [
    {
      name: 'File 1',
      url: 'editor://deadbeef/',
    },
  ],
  'Empty category': [],
};

export const BasicFileFolderListing = () => (
  <FileFolderListing name='Hello world' categories={categories} showEmpty={true} />
);

export const HideEmptyFileFolderListing = () => (
  <FileFolderListing name='Hello world' categories={categories} showEmpty={false} />
);
