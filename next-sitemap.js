module.exports = {
  siteUrl: 'https://www.globalforestwatch.org',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  exclude: [
    '/404',
    '/search',
    '/thank-you',
    '/browser-support',
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
        priority: '0.7',
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }

    return {
      loc: url,
      changefreq: config.changefreq,
      priority: '1.0',
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
