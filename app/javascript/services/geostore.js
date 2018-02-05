import axios from 'axios';

const REQUEST_URL = `${process.env.RESOURCE_WATCH_API_URL}/geostore/admin/`;

export const getGeostoreProvider = (country, region, subRegion) => {
  const url = `${REQUEST_URL}${country}${region ? `/${region}` : ''}${
    subRegion ? `/${subRegion}` : ''
  }`;
  return axios.get(url);
};

export default {
  getGeostoreProvider
};
