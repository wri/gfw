import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}/gfw-metadata`;

export const getMeta = slug => {
  const url = `${REQUEST_URL}/${slug}`;
  return axios.get(url);
};

export default {
  getMeta
};
