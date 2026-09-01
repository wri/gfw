import { GFW_METADATA_API, GFW_STAGING_METADATA_API } from 'utils/apis';
import { isValidMetadataPath } from 'utils/metadata';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_METADATA_API : GFW_METADATA_API;

export default async (req, res) => {
  const path = req.query.params.join('/');

  if (!isValidMetadataPath(path)) {
    return res.status(400).json({ error: 'Invalid path parameter' });
  }

  try {
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
      const status = response.status === 404 ? 404 : 502;
      return res.status(status).json({
        error: `Metadata request failed with status ${response.status}`,
      });
    }

    const data = await response.json();

    // gfw-metadata reports missing keys as HTTP 200 with an error payload.
    if (data?.error) {
      return res.status(404).json({ error: data.error });
    }

    return res.status(200).json({ metadata: data });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
};
