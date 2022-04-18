const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/static', to: 'static' },
        { from: './demo/static', to: 'static' },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './demo/index.html',
    }),
  ],
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'demo-build'),
    filename: 'index.js',
  },
  devServer: {
    hot: true,
    static: {
      directory: path.resolve(__dirname, 'demo-build'),
      watch: true,
      serveIndex: true,
    },
  },
  target: 'browserslist',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};
