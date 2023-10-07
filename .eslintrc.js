module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    '@mscharley', // For TS projects or mixed TS/JS projects.
    // '@mscharley/eslint-config/eslint', // For JS-only projects.
    // '@mscharley/eslint-config/node', // For projects running on node.
    '@mscharley/eslint-config/react', // For projects running React.
  ],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          parameterProperties: 'off',
        },
      },
    ],
    'import/no-unresolved': ['error', { commonjs: true, ignore: ['^electron/'] }],
  },
};
