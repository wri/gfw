import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/v2/area`;

export const getAreasProvider = token =>
  axios.get(REQUEST_URL, {
    headers: { Authorization: 'Bearer '.concat(token) }
  });

export default {
  getAreasProvider
};
