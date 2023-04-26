const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const redirects = require('./data/redirects.json');
const rewrites =
  process.env.NEXT_PUBLIC_FEATURE_ENV === 'staging'
    ? require('./data/rewrites-staging.json')
    : require('./data/rewrites.json');

const nextConfig = {
  redirects: async () => redirects,
  rewrites: async () => rewrites,
  trailingSlash: true,
  images: {
    disableStaticImages: true,
  },
};

module.exports = withPlugins(
  [[optimizedImages], [withBundleAnalyzer]],
  nextConfig
);
