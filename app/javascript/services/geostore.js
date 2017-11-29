import axios from 'axios';

const APIURL = 'https://api.resourcewatch.org/v1';

const APIURLS = {
  getGeostore: '/geostore/admin/'
};

export const getGeostoreProvider = (country, region, subRegion) => {
  const url = `${APIURL}${APIURLS.getGeostore}${country}${
    region ? `/${region}` : ''
  }${subRegion ? `/${subRegion}` : ''}`;
  return axios.get(url);
};

export default {
  getGeostoreProvider
};
