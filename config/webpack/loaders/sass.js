const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const { env, settings } = require('../configuration');

const postcssConfig = resolve(process.cwd(), '.postcssrc');
const sourceMap = env.NODE_ENV === 'development';

const sassConfig = [
  {
    loader: 'css-loader'
  },
  {
    loader: 'postcss-loader',
    options: { sourceMap, config: { path: postcssConfig } }
  },
  {
    loader: `sass-loader?includePaths[]='${resolve(
      settings.source_path,
      'app'
    )}'`,
    options: { sourceMap }
  }
];

const devConfig = [{ loader: 'style-loader' }, ...sassConfig];

const prodConfig = [{ loader: MiniCssExtractPlugin.loader }, ...sassConfig];

module.exports = {
  test: /\.(scss|sass|css)$/i,
  use: env.NODE_ENV === 'production' ? prodConfig : devConfig
};
