import { closeCurrentFile, setActiveOverlay, setFatalError, setFileListing } from '~renderer/redux/index.js';
import { HelpOutline as HelpOutlineIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~renderer/hooks/index.js';
import { SpinningRefreshIcon } from '../SpinningRefreshIcon.js';
import { useState } from 'react';

export interface SidebarFooterProps {
	width: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ width }) => {
	const dispatch = useAppDispatch();
	const [spinning, setSpinning] = useState(false);
	const currentFile = useAppSelector((s) => s.files.currentFile);

	const handleRefresh: React.MouseEventHandler = () => {
		setSpinning(true);

		window.editorApi
			.listNoteFiles()
			.then((fs) => {
				dispatch(setFileListing(fs));

				const newFiles = Object.values(fs)
					.flatMap((f) => f.categories)
					.flatMap((c) => c.files);
				if (newFiles.find((f) => f.url === currentFile?.url) == null) {
					// Currently editing file no longer exists...
					dispatch(closeCurrentFile());
				}

				setSpinning(false);
			})
			.catch((e: unknown) => {
				dispatch(setFatalError(e));
			});
	};

	return (
		<Paper
			variant="outlined"
			square
			sx={{
				borderLeft: '0',
				borderBottom: '0',
				borderRight: '0',
				position: 'fixed',
				bottom: '0px',
				left: '0px',
				width: width,
				display: 'flex',
				flexDirection: 'row-reverse',
			}}
		>
			<Tooltip title="Configuration (Ctrl-,)">
				<IconButton
					onClick={(): void => {
						dispatch(setActiveOverlay('configuration'));
					}}
				>
					<SettingsIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="About">
				<IconButton
					onClick={(): void => {
						dispatch(setActiveOverlay('about'));
					}}
				>
					<HelpOutlineIcon />
				</IconButton>
			</Tooltip>
			<Tooltip title="Refresh notes list">
				<IconButton onClick={handleRefresh}>
					<SpinningRefreshIcon spinning={spinning} />
				</IconButton>
			</Tooltip>
		</Paper>
	);
};
