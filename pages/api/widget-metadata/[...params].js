import { GFW_METADATA_API, GFW_STAGING_METADATA_API } from 'utils/apis';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_METADATA_API : GFW_METADATA_API;

export default async (req, res) => {
  try {
    const path = req.query.params.join('/');
    const url = `${GFW_METADATA_API_URL}/${path}/`;

    const response = await fetch(url, { next: { revalidate: 120 } });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
