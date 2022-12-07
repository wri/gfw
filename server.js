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

function handleNonWwwToWwwRedirect(req, res) {
  try {
    const host = req.header('host');
    if (!host.match(/^www\..*/i)) {
      res.redirect(301, `https://www.${host}${req.url}`);
    }
  } catch (_i) {
    // Ignore by default
  }
}

app.prepare().then(() => {
  const server = express();

  server.use(sslRedirect(['production'], 301));

  server.all(/.*/, (req, res) => {
    handleNonWwwToWwwRedirect(req, res);
    handleRedirectFor(waterUrls, req.url, res);

    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line
  });
});
