// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

// eslint-disable-next-line
const webpack = require('webpack');
const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const sharedConfig = require('./shared.js');

module.exports = merge(sharedConfig, {
  output: {
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  stats: 'normal',
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: false
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name]-[contenthash].css'
    }),
    new webpack.EnvironmentPlugin(['GOOGLE_ANALYTICS_ID']),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin()
  ]
});
