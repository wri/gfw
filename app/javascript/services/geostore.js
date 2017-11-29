import axios from 'axios';

const APIURL = 'https://api.resourcewatch.org/v1';

const APIURLS = {
  getGeostore: '/geostore/admin/'
};

export const getGeostoreProvider = (country, region) => {
  const url = `${APIURL}${APIURLS.getGeostore}${country}${
    region ? `/${region}` : ''
  }`;
  return axios.get(url);
};

export default {
  getGeostoreProvider
};
