import { Add as AddIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { Divider, IconButton, ListItem, ListItemText, Tooltip } from '@mui/material';
import type { CategoryDescription } from '~shared/model/index.js';
import { FileCategoryListing } from './FileCategoryListing.js';
import { useState } from 'react';

export interface FileFolderListingProps {
	name: string;
	baseUrl: string;
	categories: CategoryDescription[];
	showEmpty?: boolean;
}

export const FileFolderListing: React.FC<FileFolderListingProps> = ({
	baseUrl,
	categories,
	showEmpty: defaultShowEmpty,
	name,
}) => {
	const [showEmpty, setShowEmpty] = useState<boolean>(defaultShowEmpty ?? false);

	return (
		<>
			<ListItem
				secondaryAction={(
					<>
						{showEmpty
							? (
								<Tooltip title="Hide empty categories" placement="bottom">
									<IconButton onClick={(): void => setShowEmpty(false)}>
										<VisibilityIcon />
									</IconButton>
								</Tooltip>
								)
							: (
								<Tooltip title="Show empty categories" placement="bottom">
									<IconButton onClick={(): void => setShowEmpty(true)}>
										<VisibilityOffIcon />
									</IconButton>
								</Tooltip>
								)}
						<Tooltip title="Add new category" placement="bottom">
							<IconButton>
								<AddIcon />
							</IconButton>
						</Tooltip>
					</>
				)}
			>
				<ListItemText primary={name} />
			</ListItem>
			{categories.map(({ name: categoryName, path, files }) =>
				!showEmpty && files.length === 0
					? null
					: (
						<FileCategoryListing
							key={`${name}-${categoryName}`}
							baseUrl={`${baseUrl}${path}`}
							name={categoryName}
							files={files}
						/>
						),
			)}
			<Divider />
		</>
	);
};
