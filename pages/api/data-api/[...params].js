import httpProxyMiddleware from 'next-http-proxy-middleware';

import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const DATA_API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY;
const GFW_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

export default (req, res) =>
  httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: GFW_API_URL,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy`
    pathRewrite: {
      '^/?/api/data-api': '/',
    },
    headers: {
      'x-api-key': DATA_API_KEY,
    },
    followRedirects: true,
  }).catch(async (error) => {
    res.end(error.message);
  });
