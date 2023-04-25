const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const redirects = require('./data/redirects.json');
const rewrites =
  process.env.NEXT_PUBLIC_FEATURE_ENV === 'staging'
    ? require('./data/rewrites-staging.json')
    : require('./data/rewrites.json');

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
    });

    return config;
  },
  redirects: async () => redirects,
  rewrites: async () => rewrites,
  trailingSlash: true,
};

module.exports = withPlugins([withBundleAnalyzer], nextConfig);
