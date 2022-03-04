export { reducer } from './reducer';
export type { AppDispatch, RootState, Store } from './store';
export { generateStore } from './store';

export { setAboutDetails } from './about/details-slice';
export { updateAppConfiguration } from './configuration/configuration-slice';
export { setFatalError } from './fatal-errors/errors-slice';
export { closeCurrentFile, setCurrentFile, setFileListing } from './markdown-files/files-slice';
export { closeOverlay, overrideActiveOverlay, setActiveOverlay } from './overlay/overlay-slice';