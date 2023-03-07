const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const Dotenv = require('dotenv-webpack');

console.log(path.resolve( __dirname, 'src' ));

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
    extensions: ['', '.ts'],
    alias: {
      '~': path.resolve( __dirname, 'src' ),
    },
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
