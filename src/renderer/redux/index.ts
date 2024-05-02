export { reducer } from './reducer.js';
export type { AppDispatch, RootState, Store } from './store.js';
export { generateStore } from './store.js';

export { setAboutDetails } from './about/details-slice.js';
export { updateAppConfiguration } from './configuration/configuration-slice.js';
export { setFatalError } from './fatal-errors/errors-slice.js';
export { closeCurrentFile, setCurrentFile, setCurrentFolder, setFileListing } from './markdown-files/files-slice.js';
export { setSaving } from './notifications/notifications-slice.js';
export { closeOverlay, confirmDelete, overrideActiveOverlay, setActiveOverlay } from './overlay/overlay-slice.js';
export { setUpdateStatus } from './updates/update-slice.js';
