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
  overrides: [
    {
      files: ['**/*.screenshot.{jsx,tsx}'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.{ts,js,tsx,jsx}'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
      },
    },
  ],
};
