const next = require('next');
const express = require('express');
const rewrite = require('express-urlrewrite');
const sslRedirect = require('heroku-ssl-redirect').default;
const waterRedirects = require('./data/water-redirects');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const externalWaterUrls = {};
waterRedirects.forEach((wr) => {
  if (wr.external) {
    externalWaterUrls[wr.source] = wr.destination;
  }
});

app.prepare().then(() => {
  const server = express();

  server.use(sslRedirect());

  waterRedirects.forEach((pathDef) => {
    if (!pathDef.external) {
      server.use(rewrite(pathDef.source, pathDef.destination));
    }
  });

  server.all('*', (req, res) => {
    try {
      if (externalWaterUrls[req.url]) {
        res.redirect(externalWaterUrls[req.url]);
      }
    } catch (_i) {
      // Ignore by default
    }
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line
  });
});
