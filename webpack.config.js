const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const Dotenv = require('dotenv-webpack');



module.exports = (env) => {
  console.log(env);
  return {
    context: __dirname,
    entry: env.MODE === 'setup' ? './src/setup.ts' : './src/main.ts',
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
        '~': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'code.gs',
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: 'src/assets' }],
      }),
      new GasPlugin({
        autoGlobalExportsFiles: ['**/*.js'],
      }),
      new Dotenv(),
    ],
  };
}
