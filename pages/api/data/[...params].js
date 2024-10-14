import httpProxyMiddleware from 'next-http-proxy-middleware';

import { GFW_DATA_API } from 'utils/apis';
import { PROXIES } from 'utils/proxies';

const GFW_API_KEY = process.env.NEXT_PUBLIC_GFW_API_KEY;
const DATA_API_URL = GFW_DATA_API;

// https://github.com/stegano/next-http-proxy-middleware/issues/32#issuecomment-1031015850
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req, res) =>
  httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: DATA_API_URL,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy`
    pathRewrite: [
      {
        patternStr: `^/?${PROXIES.DATA_API}`,
        replaceStr: '/',
      },
    ],
    headers: {
      'x-api-key': GFW_API_KEY,
    },
    followRedirects: true,
  }).catch(async (error) => {
    res.end(error.message);
  });
