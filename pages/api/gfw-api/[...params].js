import axios from 'axios';

import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const DATA_API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY;
const GFW_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

export const handleProxyOrigin = () => {
  if (ENVIRONMENT === 'staging') {
    return 'https://staging.globalforestwatch.org/';
  }
  if (ENVIRONMENT === 'preproduction') {
    return 'https://preproduction.globalforestwatch.org/';
  }
  return 'https://www.globalforestwatch.org';
};

export default async (req, res) => {
  const { url, body, method } = req;
  try {
    const serializeUrl = url.replace('/api/gfw-api/', '');
    const instance = axios.create({
      baseURL: GFW_API_URL,
      headers: {
        origin: handleProxyOrigin(),
        'x-api-key': DATA_API_KEY,
        'content-type': 'application/json'
      }
    });

    let response;

    if (method === 'GET') {
      response = await instance.get(serializeUrl);
    }

    if (method === 'POST') {
      response = await instance.post(serializeUrl, body);
    }

    if (method === 'PUT') {
      response = await instance.put(serializeUrl, body);
    }

    if (method === 'DELETE') {
      response = await instance.delete(serializeUrl, body);
    }

    res.status(response.status).json(response.data)
  } catch (e) {
    res.status(e.status || 500).json(e.data || 'Error, could not fetch data from GFW');
  }
}