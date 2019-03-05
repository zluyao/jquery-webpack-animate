var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionWebpackPlugin = require('compression-webpack-plugin');

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
    minify: {
      removeComments: true,
      collapseWhitespace: true,
    },
    inlineSource: /manifest-.*\.js$/,
    template: path.resolve(v.path, 'index.html'),
    chunks: ['manifest', 'vendor', v.name],
  }))
  .value();

module.exports = merge(config, {
  output: {
    publicPath: '/',
    filename: 'js/[name]-[chunkhash:8].js',
    path: resolve('../dist'),
    chunkFilename: 'js/chunks/[id]-[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
            interpolate: true,
            removeComments: false,
            collapseWhitespace: false,
            removeAttributeQuotes: false,
            attrs: ['img:src', 'img:data-href', 'video:poster', 'li:data-href', 'img:data-hover'],
          },
        }],
      },
      {
        test: /\.global\.less$/,
        exclude: /\.attached\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            { loader: 'less-loader' },
          ],
          publicPath: '/',
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name]-[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name]-[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: true,
        output: {
          comments: false,
          beautify: false,
        },
        mangle: {
          keep_fnames: true,
        },
        compress: {
          warnings: false,
          drop_console: true,
        },
      },
    }),
    ...folders,
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css|svg)$/,
      threshold: 1024 * 30,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    new ExtractTextPlugin('css/[name]-[contenthash:8].css'),
    // new BundleAnalyzerPlugin({
    //   openAnalyzer: false,
    // }),
  ],
});
