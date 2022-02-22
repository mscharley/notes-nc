import errorReducer from './fatal-errors/errors-slice';
import filesReducer from './markdown-files/files-slice';

export const reducer = {
  fatalError: errorReducer,
  files: filesReducer,
} as const;
