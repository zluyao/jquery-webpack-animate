var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var config = require('./webpack.config');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const targetPath = path.resolve(__dirname, '../src/client')
  , files = fs.readdirSync(targetPath)

const folders = _.chain(files)
  .map(v => ({ name: v, path: path.resolve(targetPath, v) }))
  .filter(v => fs.statSync(v.path).isDirectory()).map(v => new HtmlWebpackPlugin({
    filename: v.name === 'index' ? `${v.name}.html` : `${v.name}/index.html`,
    inlineSource: /manifest\.js$/,
    template: path.resolve(v.path, 'index.html'),
    chunks: ['manifest', 'vendor', v.name],
  }))
  .value();

module.exports = merge(config, {
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    path: resolve('../dist'),
    chunkFilename: 'js/chunks/[id].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
            removeAttributeQuotes: false,
            attrs: ['img:src', 'img:data-href', 'video:poster', 'li:data-href', 'img:data-hover'],
          },
        },
      },
      {
        test: /\.global\.less$/,
        exclude: /\.attached\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'less-loader' },
          ],
          publicPath: '/',
        }),
      },
      {
        test: /\.(gif|jpg|jpeg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name].[ext]',
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    ...folders,
    new ExtractTextPlugin('css/[name].css'),
    // new webpackBundleAnalyzer.BundleAnalyzerPlugin({
    //   openAnalyzer: false,
    // }),
  ],
});
