import { GFW_DATA_API, GFW_STAGING_DATA_API } from 'utils/apis';
import axios from 'axios';

const ENVIRONMENT = process.env.NEXT_PUBLIC_RW_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_DATA_API : GFW_DATA_API;

export default async (req, res) => {
  try {
    const path = req.query.params.join('/');
    const url = `${GFW_METADATA_API_URL}/${path}/`;

    const response = await axios.get(url);

    return res.status(200).json(response.data.data);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
