import React from 'react';
import routes from 'app/routes';
import {
  APP_URL,
  DEVELOPERS_URL,
  HOWTO_URL,
  DATA_PORTAL_URL,
  BLOG_URL,
} from 'utils/constants';

const sitemapXml = () => {
  let pageXml = '';
  Object.keys(routes).forEach((path) => {
    const { priority, allowedParams } = routes[path];
    if (priority && !allowedParams) {
      pageXml = `${pageXml}<url><loc>${APP_URL}${path}</loc><changefreq>weekly</changefreq><priority>${
        priority || '1.0'
      }</priority></url>`;
    }

    if (allowedParams) {
      const paramKeys = Object.keys(allowedParams);
      paramKeys.forEach((key) => {
        const paramValues = allowedParams[key];
        paramValues.forEach((value) => {
          pageXml = `${pageXml}<url><loc>${APP_URL}${path.replace(
            `[${key}]`,
            value
          )}</loc><changefreq>weekly</changefreq><priority>${
            priority || '1.0'
          }</priority></url>`;
        });
      });
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pageXml}
    <url>
      <loc>${DEVELOPERS_URL}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.4</priority>
    </url>
    <url>
      <loc>${HOWTO_URL}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.4</priority>
    </url>
    <url>
      <loc>${DATA_PORTAL_URL}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.4</priority>
    </url>
    <url>
      <loc>${BLOG_URL}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.4</priority>
    </url>
  </urlset>`;
};

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    if (!res) return {};
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapXml());
    res.end();

    return {};
  }
}

export default Sitemap;
