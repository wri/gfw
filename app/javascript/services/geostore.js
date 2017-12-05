import axios from 'axios';

const API_URL = process.env.RESOURCE_WATCH_API_URL;

export const getGeostoreProvider = (country, region) => {
  const url = `${API_URL}/geostore/admin/${country}${
    region ? `/${region}` : ''
  }`;
  return axios.get(url);
};

export default {
  getGeostoreProvider
};
