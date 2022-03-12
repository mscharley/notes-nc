import { useAppSelector, useDebouncedState } from '~renderer/hooks';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/system/Box';
import SaveAsSharp from '@mui/icons-material/SaveAsSharp';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';
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
  pointerEvents: 'none',
  background: context.theme.palette.background.paper,
}));

const fontSize = 'small';

export const NotificationsOverlay: React.FC = () => {
  const isDev = useAppSelector((s) => s.about.details?.isDevBuild) ?? false;
  const notificationsState = useAppSelector((s) => s.notifications);
  const [saving, setSaving, flushSaving] = useDebouncedState(false, 2_000);

  useEffect(() => {
    setSaving(notificationsState.saving);
    if (notificationsState.saving) {
      flushSaving();
    }
  }, [setSaving, flushSaving, notificationsState.saving]);

  const devBuild = isDev ? (
    <Typography component='div' key='dev' fontSize={fontSize}>
      DEV BUILD
    </Typography>
  ) : null;
  const saveIcon = saving ? <SaveAsSharp key='save' fontSize={fontSize} /> : null;

  const notifications = [devBuild, saveIcon].filter((x) => x != null);

  return notifications.length > 0 ? <NotificationsBox>{notifications}</NotificationsBox> : <></>;
};
