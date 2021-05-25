import axios from 'axios';

import { ObjectToQueryString } from 'utils/url';

import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const DATA_API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY;
const GFW_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

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
          'x-api-key': DATA_API_KEY,
        },
      });

      res.setHeader('content-type', 'application/json');
      res.send(apiData?.data);
    } catch (err) {
      res.status(500).end('Error getting data');
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
