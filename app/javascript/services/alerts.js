import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}`;
const DATASET = process.env.GLAD_PRECALC_DATASET;

const QUERIES = {
  gladAlerts: '{location}?aggregate_values=true&aggregate_by={period}',
  gladIntersectionAlerts:
    "SELECT iso, adm1, adm2, alert_count as count, alert_date as date, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}'",
  viirsAlerts:
    '{location}?group=true&period={period}&thresh=0&geostore={geostore}'
};

const getLocationQuery = (country, region, subRegion) =>
  `${country}${region ? `/${region}` : ''}${subRegion ? `/${subRegion}` : ''}`;

const getLocation = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const fetchGladAlerts = ({ country, region, subRegion, period }) => {
  const url = `${REQUEST_URL}/glad-alerts/admin/${QUERIES.gladAlerts}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{period}', period || 'week');
  return axios.get(url);
};

export const fetchGladIntersectionAlerts = ({
  country,
  region,
  indicator,
  period
}) => {
  const url = `${REQUEST_URL}/query/${DATASET}?sql=${
    QUERIES.gladIntersectionAlerts
  }`
    .replace('{location}', getLocation(country, region))
    .replace('{polyname}', indicator)
    .replace('{period}', 4 || 'week');
  return axios.get(url);
};

export const fetchGLADLatest = () => {
  const url = `${REQUEST_URL}/glad-alerts/latest`;
  return axios.get(url);
};

export const fetchViirsAlerts = ({
  country,
  region,
  subRegion,
  geostore,
  dates
}) => {
  const url = `${REQUEST_URL}/viirs-active-fires/${!subRegion ? 'admin/' : ''}${
    QUERIES.viirsAlerts
  }`
    .replace(
      '{location}',
      !subRegion ? getLocationQuery(country, region, subRegion) : ''
    )
    .replace('{geostore}', subRegion && geostore ? geostore : '')
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return axios.get(url);
};
