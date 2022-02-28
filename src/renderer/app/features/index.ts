import aboutReducer from './about/details-slice';
import errorReducer from './fatal-errors/errors-slice';
import filesReducer from './markdown-files/files-slice';

export const reducer = {
  about: aboutReducer,
  fatalError: errorReducer,
  files: filesReducer,
} as const;
