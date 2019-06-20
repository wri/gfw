import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/area`;

export const getAreasProvider = token =>
  axios.get(REQUEST_URL, {
    headers: { Authorization: 'Bearer '.concat(token) }
  });

export default {
  getAreasProvider
};
