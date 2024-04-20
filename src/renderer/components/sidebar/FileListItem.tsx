import { Article as ArticleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ClickAwayListener, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, TextField } from '@mui/material';
import { closeCurrentFile, confirmDelete, setCurrentFile, setFatalError } from '~renderer/redux/index.js';
import type { FileDescription } from '~shared/model/index.js';
import type { ListItemProps } from '@mui/material';
import { useAppDispatch } from '~renderer/hooks/index.js';
import { useState } from 'react';

export interface FileListItemProps {
	file: FileDescription;
	selected?: boolean;
}

const File = styled(ListItem)<ListItemProps>`
	& > .MuiListItemSecondaryAction-root {
		opacity: 0;
		transition: opacity cubic-bezier(0.16, 0.83, 0.55, 1) 400ms;
	}

	&:hover > .MuiListItemSecondaryAction-root {
		opacity: 1;
	}
`;

export const FileListItem: React.FC<FileListItemProps> = ({ file, selected }) => {
	const dispatch = useAppDispatch();
	const [filename, setFilename] = useState(file.displayName);
	const [editing, setEditing] = useState(false);

	const handleClickAway = (): void => {
		setEditing(false);
		dispatch(closeCurrentFile());
		window.editorApi
			.renameNoteFile(file, filename)
			.then((newFile) => {
				if (newFile != null) {
					dispatch(setCurrentFile(newFile));
				}
			})
			.catch((e) => dispatch(setFatalError(e)));
	};

	const handleDelete: React.MouseEventHandler = () => {
		dispatch(confirmDelete(file));
	};

	return editing
		? (
			<ClickAwayListener onClickAway={handleClickAway}>
				<ListItem>
					<ListItemIcon>
						<ArticleIcon />
					</ListItemIcon>
					<ListItemText
						primary={(
							<TextField
								autoFocus={true}
								label={file.displayName}
								value={filename}
								onChange={(ev): void => setFilename(ev.target.value)}
								onKeyUp={(ev): void => {
									if (ev.key === 'Escape') {
										setEditing(false);
									}
								}}
								onKeyPress={(ev): void => {
									if (ev.key === 'Enter') {
										handleClickAway();
									}
								}}
							/>
						)}
					/>
				</ListItem>
			</ClickAwayListener>
			)
		: (
			<File
				disablePadding
				secondaryAction={(
					<IconButton onClick={handleDelete}>
						<DeleteIcon />
					</IconButton>
				)}
			>
				<ListItemButton
					selected={selected}
					onClick={(): void => {
						dispatch(setCurrentFile(file));
					}}
					onDoubleClick={(): void => setEditing(true)}
				>
					<ListItemIcon>
						<ArticleIcon />
					</ListItemIcon>
					<ListItemText primary={file.displayName} />
				</ListItemButton>
			</File>
			);
};
