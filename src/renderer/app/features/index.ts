import filesReducer from './markdown-files/files-slice';
import titleReducer from './title/title-slice';

export const reducer = {
  files: filesReducer,
  title: titleReducer,
} as const;
