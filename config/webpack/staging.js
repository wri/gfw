// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge');
const sharedConfig = require('./production.js');

module.exports = merge(sharedConfig, {});
