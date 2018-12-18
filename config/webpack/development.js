// Note: You must restart bin/webpack-dev-server for changes to take effect

// eslint-disable-next-line
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');
const sharedConfig = require('./shared.js');
const { settings, output } = require('./configuration.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = merge(sharedConfig, {
  devtool: '#eval-source-map',
  mode: 'development',
  stats: { errorDetails: true },
  output: { pathinfo: true },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
    new BundleAnalyzerPlugin()
  ],
  devServer: {
    clientLogLevel: 'none',
    https: settings.dev_server.https,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    contentBase: output.path,
    publicPath: output.publicPath,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    watchOptions: { ignored: /node_modules/ },
    hot: true,
    hotOnly: true
  }
});
