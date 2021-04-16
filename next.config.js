const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const redirects = require('./data/redirects');

const FEATURE_ENV = process.env.NEXT_PUBLIC_FEATURE_ENV;

let rewrites;

if (FEATURE_ENV === 'staging') {
  // eslint-disable-next-line global-require
  rewrites = require('./data/rewrites-staging');
} else {
  // eslint-disable-next-line global-require
  rewrites = require('./data/rewrites');
}

const nextConfig = {
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,
      // mini-css-extract-plugin generates a warning when importing css as modules
      // https://github.com/zeit/next-plugins/issues/506#issuecomment-589269285
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }),
    ];

    config.node = {
      fs: 'empty',
    };

    return config;
  },
  redirects: async () => redirects,
  rewrites: async () => rewrites,
  trailingSlash: true,
};

module.exports = withPlugins(
  [[withSass], [optimizedImages], [withBundleAnalyzer]],
  nextConfig
);
