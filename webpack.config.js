const GasPlugin = require('gas-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  context: __dirname,
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /(\.ts)$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    path: __dirname ,
    filename: 'code.gs',
  },
  plugins: [
    new GasPlugin({
      autoGlobalExportsFiles: ['**/*.js'],
    }),
    new Dotenv(),
  ],
}
