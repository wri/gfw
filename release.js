const releaseDescription = require('./release.md');

module.exports = markdown => `${releaseDescription}\n\n${markdown}`;
