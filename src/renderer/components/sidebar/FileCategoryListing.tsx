import { ClickAwayListener, Divider, Grow, IconButton, ListItem, ListItemText, TextField, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~renderer/hooks/index.js';
import { Add as AddIcon } from '@mui/icons-material';
import type { FileDescription } from '~shared/model/index.js';
import { FileListItem } from './FileListItem.js';
import { setFatalError } from '~renderer/redux/index.js';
import { useState } from 'react';

export interface FileCategoryListingProps {
	name: string;
	baseUrl: string;
	files: FileDescription[];
}

export const FileCategoryListing: React.FC<FileCategoryListingProps> = ({ name, baseUrl, files }) => {
	const dispatch = useAppDispatch();
	const currentFileUrl = useAppSelector((s) => s.files.currentFile?.url);
	const [addingItem, setAddingItem] = useState(false);
	const [addedItem, setAddedItem] = useState('');

	const handleClickAway = (): void => {
		setAddingItem(false);

		if (addedItem === '') {
			return;
		}
		setAddedItem('');

		fetch(`${baseUrl}/${addedItem}.md`, {
			method: 'PUT',
			headers: {
				'content-type': 'text/plain',
			},
			body: '',
		}).catch((e) => dispatch(setFatalError(e)));
	};

	return (
		<>
			<Divider />
			<ListItem
				key={name}
				secondaryAction={(
					<Tooltip title="Add new note" placement="bottom">
						<IconButton onClick={(): void => setAddingItem(true)}>
							<AddIcon />
						</IconButton>
					</Tooltip>
				)}
				sx={{ background: 'rgba(0,0,0,0.05)' }}
			>
				<ListItemText
					primary={name}
					primaryTypographyProps={{
						fontWeight: 'medium',
						lineHeight: '2em',
					}}
				/>
			</ListItem>
			{addingItem
				? (
					<Grow in={true} style={{ transformOrigin: '0 0 0' }}>
						<ListItem>
							<ClickAwayListener onClickAway={handleClickAway}>
								<TextField
									value={addedItem}
									autoFocus={true}
									onChange={(ev): void => setAddedItem(ev.target.value)}
									onKeyUp={(ev): void => {
										if (ev.key === 'Escape') {
											setAddedItem('');
											setAddingItem(false);
										}
									}}
									onKeyPress={(ev): void => {
										if (ev.key === 'Enter') {
											handleClickAway();
										}
									}}
								/>
							</ClickAwayListener>
						</ListItem>
					</Grow>
					)
				: null}
			{files.map((f) => (
				<FileListItem key={f.url} file={f} selected={f.url === currentFileUrl} />
			))}
		</>
	);
};
