var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const targetPath = path.resolve(__dirname, '../src/client')
  , files = fs.readdirSync(targetPath)

function getEntryPoint(folder) {
  const filename = path.resolve(folder, 'index.js');
  if (fs.existsSync(filename)) {
    return filename;
  }

  return `${filename}x`;
}

const folders = _.chain(files)
  .map(v => ({ name: v, path: path.resolve(targetPath, v) }))
  .filter(v => fs.statSync(v.path).isDirectory()).map(v => [v.name, getEntryPoint(v.path)])
  .object()
  .value();

module.exports = {
  devtool: false,
  entry: {
    vendor: [
      'jquery',
      resolve('../src/res'),
      resolve('../src/lib/polyfill'),
    ],
    ...folders,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: resolve('../src'),
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.attached\.less$/,
        exclude: /\.global\.less$/,
        use: [
          { loader: 'style-loader/useable' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.less$/,
        exclude: [/\.global\.less$/, /\.attached\.less$/],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.html', '.attached.less', '.global.less', '.less'],
    alias: {
      '~': resolve('../src/client'),
      '$lib': resolve('../src/lib'),
      '$res': resolve('../src/res'),
      'fullpage.js': resolve('../src/lib/fullpage/jquery.fullpage.js')
    },
  },
  plugins: [
    // new CopyWebpackPlugin([
    //   {
    //     from: resolve('../src/static'),
    //     to: resolve('../dist/static'),
    //     toType: 'dir'
    //   },
    // ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
      'preact': 'preact',
    }),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      minChunks: 3,
      async: true,
    }),
  ],
};
