module.exports = {
  context: __dirname,
  entry: './src/main.js',
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: __dirname ,
    filename: 'code.gs',
  },
}
