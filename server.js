const next = require('next');
const express = require('express');
const sslRedirect = require('heroku-ssl-redirect').default;
const waterRedirects = require('./data/water-redirects');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const waterUrls = {};

waterRedirects.forEach((wr) => {
  waterUrls[wr.source] = wr.destination;
});

function handleRedirectFor(urls, url, res) {
  try {
    if (urls[url]) {
      res.redirect(urls[url]);
    }
  } catch (_i) {
    // Ignore by default
  }
}

app.prepare().then(() => {
  const server = express();

  server.use(sslRedirect());

  server.all('*', (req, res) => {
    // Handle water redirects
    handleRedirectFor(waterUrls, req.url, res);
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line
  });
});
