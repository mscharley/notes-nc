import { setFileListing, updateAppConfiguration } from '~renderer/redux';
import { ConfigurationForm } from './ConfigurationForm';
import { useAppDispatch } from '~renderer/hooks';

export const NoteFolders = () => {
  const dispatch = useAppDispatch();
  dispatch(
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
  dispatch(updateAppConfiguration({ isLinux: false }));

  return <ConfigurationForm initialTab={0} />;
};

export const SecondTab = () => {
  const dispatch = useAppDispatch();
  dispatch(updateAppConfiguration({ isLinux: false }));

  return <ConfigurationForm initialTab={1} />;
};
