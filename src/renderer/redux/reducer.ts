import aboutReducer from './about/details-slice';
import configurationReducer from './configuration/configuration-slice';
import errorReducer from './fatal-errors/errors-slice';
import filesReducer from './markdown-files/files-slice';
import notificationsReducer from './notifications/notifications-slice';
import overlayReducer from './overlay/overlay-slice';

export const reducer = {
  about: aboutReducer,
  configuration: configurationReducer,
  fatalError: errorReducer,
  files: filesReducer,
  notifications: notificationsReducer,
  overlay: overlayReducer,
} as const;
