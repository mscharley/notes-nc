import aboutReducer from './about/details-slice';
import configurationReducer from './configuration/configuration-slice';
import errorReducer from './fatal-errors/errors-slice';
import filesReducer from './markdown-files/files-slice';
import overlayReducer from './overlay/overlay-slice';

export const reducer = {
  about: aboutReducer,
  configuration: configurationReducer,
  fatalError: errorReducer,
  files: filesReducer,
  overlay: overlayReducer,
} as const;
