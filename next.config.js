const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const redirects = require('./data/redirects.json');

let rewrites;

if (process.env.NEXT_PUBLIC_FEATURE_ENV === 'staging') {
  // eslint-disable-next-line global-require
  rewrites = require('./data/rewrites-staging.json');
} else {
  // eslint-disable-next-line global-require
  rewrites = require('./data/rewrites.json');
}

const nextConfig = {
  redirects: async () => redirects,
  rewrites: async () => rewrites,
  trailingSlash: true,
};

module.exports = withPlugins([withBundleAnalyzer], nextConfig);
