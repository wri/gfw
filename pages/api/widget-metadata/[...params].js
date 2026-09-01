import { GFW_METADATA_API, GFW_STAGING_METADATA_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_METADATA_API : GFW_METADATA_API;

export default async (req, res) => {
  try {
    const path = req.query.params.join('/');

    // Validate the path to prevent SSRF and path traversal attacks
    const isValidPath = /^[a-zA-Z0-9/_-]+$/.test(path); // Allow only alphanumeric, '/', '_', and '-'
    if (!isValidPath) {
      return res.status(400).json({ error: 'Invalid path parameter' });
    }
    const url = `${GFW_METADATA_API_URL}/${path}/?_=${Date.now()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'If-None-Match': '',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
