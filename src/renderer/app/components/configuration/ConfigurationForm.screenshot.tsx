import { ConfigurationForm } from './ConfigurationForm';
import { setFileListing } from '../../features/markdown-files/files-slice';
import { useAppDispatch } from '../../hooks';

export const NoteFolders = () => {
  useAppDispatch()(
    setFileListing({
      uuid: {
        uuid: 'uuid',
        baseUrl: 'editor://uuid',
        displayPath: '~/hello/world.md',
        localPath: '/home/tester/hello/world.md',
        name: 'Testing',
        categories: [],
      },
    }),
  );

  return <ConfigurationForm initialTab={0} />;
};

export const SecondTab = () => <ConfigurationForm initialTab={1} />;
