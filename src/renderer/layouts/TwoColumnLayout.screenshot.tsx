import type { FolderConfiguration } from '~shared/model';
import { setFileListing } from '~renderer/redux';
import { TwoColumnLayout } from './TwoColumnLayout';
import { useAppDispatch } from '~renderer/hooks';

const availableFiles: FolderConfiguration = {
  Test: {
    uuid: 'testing-uuid',
    name: 'Test',
    baseUrl: 'editor://testing-uuid',
    displayPath: 'Test',
    localPath: '/home/tester/Test',
    categories: [
      {
        name: 'Category',
        path: '/Category',
        files: [
          {
            name: 'My file.md',
            displayName: 'My file',
            url: 'editor://testing-uuid/Category/My file.md',
          },
        ],
      },
    ],
  },
};

export const BasicLayout = () => {
  const dispatch = useAppDispatch();
  dispatch(setFileListing(availableFiles));

  return <TwoColumnLayout />;
};
