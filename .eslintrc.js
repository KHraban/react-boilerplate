const paths = require('./config/paths');

module.exports = {
  env: {
    // https://stackoverflow.com/questions/55807824/describe-is-not-defined-when-installing-jest
    jest: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  // https://stackoverflow.com/questions/60773362/how-to-lint-js-and-ts-files-with-different-eslint-configs-at-the-same-time
  overrides: [{
    files: ['*.ts', '*.tsx'],
    env: {
      // https://stackoverflow.com/questions/55807824/describe-is-not-defined-when-installing-jest
      jest: true,
    },
    // https://www.npmjs.com/package/@typescript-eslint/parser#configuration
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      // https://github.com/typescript-eslint/typescript-eslint/issues/1723
      project: paths.appTsConfig,
      tsconfigRootDir: __dirname,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: [
      '@typescript-eslint',
    ],
    // https://github.com/dustinspecker/awesome-eslint#configs
    extends: [
      'airbnb-typescript',
      'airbnb/hooks',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
  }],
};
