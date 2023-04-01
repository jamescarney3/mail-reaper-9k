module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
    'webpack.config.js',
  ],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
  },
};
