import { Box, Chip, CircularProgress, Divider, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~renderer/hooks/index.js';
import AddCategoryChip from './AddCategoryChip.js';
import { AddFolder } from './AddFolder.js';
import { Delete } from '@mui/icons-material';
import React from 'react';
import { setFatalError } from '~renderer/redux/index.js';

const handleDelete = (dispatch: ReturnType<typeof useAppDispatch>, uuid: string) => (): void => {
	window.editorApi.deleteFolder(uuid).catch((e) => dispatch(setFatalError(e)));
};

export const FolderTab: React.FC = () => {
	const folders = useAppSelector((state) => state.files.folders);
	const dispatch = useAppDispatch();

	return folders == null
		? (
			<Box sx={{ p: 3 }}>
				<CircularProgress />
			</Box>
			)
		: (
			<List>
				{Object.values(folders).map(({ name, uuid, displayPath, categories }) => (
					<React.Fragment key={uuid}>
						<ListItem
							secondaryAction={(
								<IconButton onClick={handleDelete(dispatch, uuid)}>
									<Delete />
								</IconButton>
							)}
						>
							<ListItemText primary={name} secondary={displayPath} />
							{categories
								.filter((v) => v.path !== '/')
								.map(({ name: category, path: categoryPath }) => (
									<Chip
										key={category}
										label={category}
										size="small"
										sx={{ marginRight: 1 }}
										onDelete={(): void => {
											window.editorApi.deleteCategory(uuid, categoryPath).catch((e) => dispatch(setFatalError(e)));
										}}
									/>
								))}
							<AddCategoryChip folder={uuid} />
						</ListItem>
						<Divider component="li" />
					</React.Fragment>
				))}
				<ListItem>
					<AddFolder />
				</ListItem>
			</List>
			);
};
