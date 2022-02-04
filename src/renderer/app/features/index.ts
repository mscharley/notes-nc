import filesReducer from './markdown-files/files-slice';

export const reducer = {
  files: filesReducer,
} as const;
