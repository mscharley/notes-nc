import { closeCurrentFile, setCurrentFolder } from '~renderer/redux/index.js';
import { FormControl, InputLabel, List, MenuItem, Paper, Select, styled, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~renderer/hooks/index.js';
import { FileCategoryListing } from './FileCategoryListing.js';
import type { PaperProps } from '@mui/material/Paper';
import type { SelectChangeEvent } from '@mui/material/Select';

const ScrollablePaper = styled(Paper)<PaperProps>(() => ({
	overflowY: 'auto',
	border: '0px',
	height: '100%',
}));

export const FileListing: React.FC = () => {
	const dispatch = useAppDispatch();
	const files = useAppSelector((s) => s.files);
	const currentFolder = useAppSelector((s) => s.files.currentFolder);

	const folder = Object.values(files.folders ?? {}).find((v) => v.uuid === currentFolder);

	const handleFolderChange = (ev: SelectChangeEvent<string | null>): void => {
		if (ev.target.value != null) {
			dispatch(setCurrentFolder(ev.target.value));
			dispatch(closeCurrentFile());
		}
	};

	return (
		<ScrollablePaper variant="outlined" square>
			{files.loading
				? (
					<Typography>Loading...</Typography>
					)
				: (
					<>
						<FormControl variant="filled" sx={{ width: '100%' }}>
							<InputLabel>Note folder</InputLabel>
							<Select value={currentFolder ?? ''} id="folder" onChange={handleFolderChange}>
								{Object.values(files.folders).map(({ uuid, name }) => (
									<MenuItem key={uuid} value={uuid}>
										{name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{folder == null
							? (
								<></>
								)
							: (
								<List sx={{ padding: '0' }}>
									{folder.categories.map(({ name: categoryName, path, files: categoryFiles }) =>
										path === '/' && categoryFiles.length === 0
											? null
											: (
												<FileCategoryListing
													key={`${folder.name}-${categoryName}`}
													baseUrl={`${folder.baseUrl}${path}`}
													name={categoryName}
													files={categoryFiles}
												/>
												),
									)}
								</List>
								)}
					</>
					)}
		</ScrollablePaper>
	);
};
