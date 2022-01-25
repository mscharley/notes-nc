module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  extends: [
    '@mscharley', // For TS projects or mixed TS/JS projects.
    // '@mscharley/eslint-config/eslint', // For JS-only projects.
    // '@mscharley/eslint-config/node', // For projects running on node.
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/prefer-stateless-function': 'error',
    'react/prop-types': 'off',
  },
};
