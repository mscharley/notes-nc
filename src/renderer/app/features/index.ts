import titleReducer from './title/title-slice';

export const reducer = {
  title: titleReducer,
} as const;
