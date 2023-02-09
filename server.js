const next = require('next');
const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');
const sslRedirect = require('heroku-ssl-redirect').default;
const waterRedirects = require('./data/water-redirects');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const logger = pinoHttp({
  logger: pino({ level: 'warn' }),
  customLogLevel(req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
});
const app = next({ dev });
const handle = app.getRequestHandler();

const redirectUrls = {};

waterRedirects.forEach((wr) => {
  redirectUrls[wr.source] = wr.destination;
});

/**
 * Handles predefined url redirects.
 */
function handleRedirectFor(urls, url, res) {
  try {
    if (urls[url]) {
      res.redirect(urls[url]);
    }
  } catch (_i) {
    // Ignore by default
  }
}

/**
 * Redirects non-www urls to www urls
 */
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

  server.use(logger);

  // Redirect from http to https when NODE_ENV is set to `production`.
  // This will take an effect on the `staging`, `preproduction` and `production` environments.
  server.use(sslRedirect(['production'], 301));

  server.all(/.*/, (req, res) => {
    // Redirect from non-www to www, but only on actual `production`.
    // Note that we cannot use `NODE_ENV` for this; that environment variable is set to `production`
    //  in the `staging`, `preproduction` and `production` environments. Instead we need to use
    //  the `NEXT_PUBLIC_FEATURE_ENV` environment variable.
    // Note also that we check if the host contains 'globalforestwatch' to do this only for the
    //  production app. This way, we can point a test server to production for testing purposes
    const host = req.header('host');
    const isHostGFW = host.match(/^globalforestwatch\..*/i);

    if (process.env.NEXT_PUBLIC_FEATURE_ENV === 'production' && isHostGFW) {
      handleNonWwwToWwwRedirect(req, res);
    }

    // Handle other redirects.
    handleRedirectFor(redirectUrls, req.url, res);

    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line
  });
});
