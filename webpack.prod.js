const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src', 'index.ts'),
  },
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
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
    new CleanWebpackPlugin(),
  ],
  target: 'browserslist',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};
