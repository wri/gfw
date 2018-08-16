import request from 'utils/request';
import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;
const QUERIES = {
  geostore: '/geostore',
  admin: '/v2/geostore/admin'
};

export const getGeostoreProvider = (country, region, subRegion) => {
  const bigCountries = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN'];
  const baseThresh = bigCountries.includes(country) ? 0.05 : 0.005;
  const url = `${REQUEST_URL}${QUERIES.admin}/${country}${
    region ? `/${region}` : `?simplify=${baseThresh}`
  }${subRegion ? `/${subRegion}` : `?simplify=${baseThresh / 10}`}`;

  return request.get(url);
};

export const getGeostoreKey = geojson => {
  const url = REQUEST_URL + QUERIES.geostore;
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      geojson
    },
    url
  });
};

export default {
  getGeostoreProvider
};
