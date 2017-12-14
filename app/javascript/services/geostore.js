import axios from 'axios';

const REQUEST_URL = `${process.env.RESOURCE_WATCH_API_URL}/geostore/admin/`;

export const getGeostoreProvider = (country, region) => {
  const url = `${REQUEST_URL}${country}${region ? `/${region}` : ''}`;
  return axios.get(url);
};

export default {
  getGeostoreProvider
};
