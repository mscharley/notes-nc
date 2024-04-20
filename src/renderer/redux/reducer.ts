import aboutReducer from './about/details-slice.js';
import configurationReducer from './configuration/configuration-slice.js';
import errorReducer from './fatal-errors/errors-slice.js';
import filesReducer from './markdown-files/files-slice.js';
import notificationsReducer from './notifications/notifications-slice.js';
import overlayReducer from './overlay/overlay-slice.js';
import updateReducer from './updates/update-slice.js';

export const reducer = {
	about: aboutReducer,
	configuration: configurationReducer,
	fatalError: errorReducer,
	files: filesReducer,
	notifications: notificationsReducer,
	overlay: overlayReducer,
	updates: updateReducer,
} as const;
