import request from 'utils/request';

const REQUEST_URL = `${process.env.GFW_API}/v2/geostore/admin/`;

export const getGeostoreProvider = (country, region, subRegion) => {
  const bigCountries = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN'];
  const baseThresh = bigCountries.includes(country) ? 0.05 : 0.005;
  const url = `${REQUEST_URL}${country}${
    region ? `/${region}` : `?simplify=${baseThresh}`
  }${subRegion ? `/${subRegion}` : `?simplify=${baseThresh / 10}`}`;
  return request.get(url);
};

export default {
  getGeostoreProvider
};
