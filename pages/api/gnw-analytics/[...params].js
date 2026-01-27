import httpProxyMiddleware from 'next-http-proxy-middleware';

// https://github.com/stegano/next-http-proxy-middleware/issues/32#issuecomment-1031015850
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req, res) => {
  return httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: 'https://analytics.globalnaturewatch.org',
    pathRewrite: [
      {
        patternStr: `^/?/api/gnw-analytics`,
        replaceStr: '/',
      },
    ],
    followRedirects: true,
  }).catch(async (error) => {
    res.end(error.message);
  });
};
