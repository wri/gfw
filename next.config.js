require('dotenv').config();

const path = require('path');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const Dotenv = require('dotenv-webpack');

const nextConfig = {
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    // mini-css-extract-plugin generates a warning when importing css as modules
    // as we scope manually we can ignore this warning: https://github.com/zeit/next-plugins/issues/506#issuecomment-589269285
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      })
    );

    config.node = {
      fs: 'empty',
    };

    return config;
  },
  experimental: {
    async redirects() {
      return [
        {
          source: '/dashboards',
          destination: `/dashboards/global`,
          permanent: true,
        },
        {
          source: '/topics',
          destination: `/topics/biodiversity`,
          permanent: true,
        },
        {
          source: '/grants-and-fellowships',
          destination: `/grants-and-fellowships/projects`,
          permanent: true,
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: '/map',
          destination: '/map/global',
        },
        {
          source: '/embed/map',
          destination: '/embed/map/global',
        },
        {
          source: '/howto',
          destination: 'http://vizzuality.github.io/gfw-howto',
        },
        {
          source: '/howto/:path*',
          destination: 'http://vizzuality.github.io/gfw-howto/:path*',
        },
      ];
    },
  },
};

module.exports = withPlugins(
  [[withSass], [optimizedImages], [withBundleAnalyzer]],
  nextConfig
);
