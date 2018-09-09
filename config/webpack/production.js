// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

// eslint-disable-next-line
const dotenv = require('dotenv').config();
const webpack = require('webpack');
const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const sharedConfig = require('./shared.js');

module.exports = merge(sharedConfig, {
  output: { filename: '[name]-[chunkhash].js' },
  stats: 'normal',
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: { warnings: false },
          output: { comments: false }
        },
        sourceMap: false
      })
    ]
  },
  plugins: [
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
