import { FileFolderListing } from './FileFolderListing';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../store';

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
  <ReduxProvider store={store}>
    <FileFolderListing name='Hello world' categories={categories} showEmpty={true} />
  </ReduxProvider>
);

export const HideEmptyFileFolderListing = () => (
  <ReduxProvider store={store}>
    <FileFolderListing name='Hello world' categories={categories} showEmpty={false} />
  </ReduxProvider>
);
