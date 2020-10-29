module.exports = {
  siteUrl: 'https://www.globalforestwatch.org',
  generateRobotsTxt: false,
  sitemapSize: 50000,
  priority: 1.0,
  changefreq: 'weekly',
  exclude: [
    '/404',
    '/search',
    '/thank-you',
    '/terms',
    '/my-gfw',
    '/privacy-policy',
    '/subscribe',
  ],
  transform: (config, url) => {
    if (url.includes('/embed')) {
      return null;
    }

    if (url.includes('/map') || url.includes('/dashboards')) {
      return {
        loc: url,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }

    return {
      loc: url,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
