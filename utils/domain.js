// CommonJS on purpose: next-sitemap.js requires this directly as a plain
// Node script during `postbuild` (Node 18, no webpack/babel), so it can't
// load an ES module. Once globalnaturewatch.org is serving the app, this is
// the only line that needs to change.
const GFW_DOMAIN = 'https://www.globalnaturewatch.org';

module.exports = { GFW_DOMAIN };
