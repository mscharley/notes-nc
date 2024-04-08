import { ConfigurationForm, TabOptions } from './ConfigurationForm';
import { setFileListing, updateAppConfiguration } from '~renderer/redux';
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
				categories: [
					{ name: 'First category', path: '/First category', files: [] },
					{ name: 'Second category', path: '/Second category', files: [] },
				],
			},
		}),
	);
	dispatch(updateAppConfiguration({ isAppImage: false }));

	return <ConfigurationForm initialTab={TabOptions.FolderManagement} />;
};

export const SecondTab = () => {
	const dispatch = useAppDispatch();
	dispatch(updateAppConfiguration({ isAppImage: false }));

	return <ConfigurationForm initialTab={TabOptions.TBC} />;
};
