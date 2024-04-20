import { Autorenew, SaveAsSharp } from '@mui/icons-material';
import { Box, styled, Tooltip, Typography } from '@mui/material';
import { useAppSelector, useDebouncedState } from '~renderer/hooks/index.js';
import type { BoxProps } from '@mui/system/Box';
import { useEffect } from 'react';

const NotificationsBox = styled(Box)<BoxProps>((context) => ({
	position: 'fixed',
	bottom: 0,
	right: 0,
	height: 35,
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'row-reverse',
	columnGap: '0.5em',
	padding: '0 0.5em',
	borderTop: '1px solid',
	borderLeft: '1px solid',
	borderColor: context.theme.palette.text.disabled,
	borderRadius: '3px 0 0 0',
	background: context.theme.palette.background.paper,
}));

const fontSize = 'small';

export const NotificationsOverlay: React.FC = () => {
	const isDev = useAppSelector((s) => s.about.details?.isDevBuild) ?? false;
	const notificationsState = useAppSelector((s) => s.notifications);
	const updateDownloaded = useAppSelector((s) => s.updates.status?.updateDownloaded ?? false);
	const [saving, setSaving, flushSaving] = useDebouncedState(false, 2_000);

	useEffect(() => {
		setSaving(notificationsState.saving);
		if (notificationsState.saving) {
			flushSaving();
		}
	}, [setSaving, flushSaving, notificationsState.saving]);

	const devBuild = isDev
		? (
			<Typography component="div" key="dev" fontSize={fontSize}>
				DEV BUILD
			</Typography>
			)
		: null;
	const saveIcon = saving ? <SaveAsSharp key="save" fontSize={fontSize} /> : null;
	const updateAvailable = updateDownloaded
		? (
			<Tooltip title="Update available">
				<Autorenew />
			</Tooltip>
			)
		: null;

	const notifications = [devBuild, saveIcon, updateAvailable].filter((x) => x != null);

	return notifications.length > 0 ? <NotificationsBox>{notifications}</NotificationsBox> : <></>;
};
