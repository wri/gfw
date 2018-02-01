import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}`;

const QUERIES = {
  gladAlerts: '{location}?aggregate_values=true&aggregate_by={period}',
  viirsAlerts: '{location}?group=true&period={period}&thresh=0'
};

const getLocationQuery = (country, region, subRegion) =>
  `${country}${region ? `/${region}` : ''}${subRegion ? `/${subRegion}` : ''}`;

export const fetchGladAlerts = ({ country, region, subRegion, period }) => {
  const url = `${REQUEST_URL}/glad-alerts/admin/${QUERIES.gladAlerts}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{period}', period || 'week');
  return axios.get(url);
};

export const fetchViirsAlerts = ({ country, region, subRegion, dates }) => {
  const url = `${REQUEST_URL}/viirs-active-fires/${!subRegion ? 'admin/' : ''}${
    QUERIES.viirsAlerts
  }`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return axios.get(url);
};
