import { GFW_NEW_METADATA_API } from 'utils/apis';
import axios from 'axios';

const GFW_METADATA_API_URL = GFW_NEW_METADATA_API;

export default async (req, res) => {
  try {
    const path = req.query.params.join('/');
    const url = `${GFW_METADATA_API_URL}/${path}/`;
    const response = await axios.get(url);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
