import axios from 'axios';

import { ObjectToQueryString } from 'utils/url';

import { handleProxyOrigin } from 'utils/request';

import { GFW_API, GFW_STAGING_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const DATA_API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY;
const GFW_API_URL = ENVIRONMENT === 'staging' ? GFW_STAGING_API : GFW_API;

export default async function userHandler(req, res) {
  const {
    query: { params, ...queryParams },
    method,
  } = req;
  if (method === 'GET') {
    try {
      const queryString = ObjectToQueryString(queryParams);
      const URL = `${GFW_API_URL}/${params.join('/')}${queryString}`;

      const apiData = await axios.get(URL, {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-cache',
          origin: handleProxyOrigin(),
          'x-api-key': DATA_API_KEY,
          ...(req?.headers?.authorization && {
            Authorization: req.headers.authorization,
          }),
        },
      });

      res.setHeader('content-type', 'application/json');
      res.send(apiData?.data);
    } catch (err) {
      if (!err?.response) {
        res.status(500).end('unknown error');
      }
      res
        .status(parseInt(err?.response?.status, 10))
        .end(err?.response?.data?.message || 'unauthorized');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
