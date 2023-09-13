const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 100000,
  responseTimeout: 100000,
  env: {
    codeCoverage: {
      url: '/api/__coverage__',
    },
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  video: false,
  lighthouse: {
    performance: 0,
    accessibility: 50,
    'best-practices': 85,
    seo: 85,
    pwa: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config); // eslint-disable-line
    },
    baseUrl: 'http://localhost:3000',
  },
});
