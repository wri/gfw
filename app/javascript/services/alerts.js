import request from 'utils/request';

const REQUEST_URL = process.env.GFW_API_HOST_PROD;
const GLAD_ISO_DATASET = process.env.GLAD_ISO_DATASET;
const GLAD_ADM1_DATASET = process.env.GLAD_ADM1_DATASET;
const GLAD_ADM2_DATASET = process.env.GLAD_ADM2_DATASET;

const QUERIES = {
  gladIntersectionAlerts:
    "SELECT iso, adm1, adm2, week, year, alerts as count, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}'",
  viirsAlerts:
    '{location}?group=true&period={period}&thresh=0&geostore={geostore}'
};

const getLocationQuery = (country, region, subRegion) =>
  `${country}${region ? `/${region}` : ''}${subRegion ? `/${subRegion}` : ''}`;

const getLocation = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const fetchGladAlerts = ({ country, region, subRegion }) => {
  let glad_summary_table = GLAD_ISO_DATASET;
  if (subRegion) {
    glad_summary_table = GLAD_ADM2_DATASET;
  } else if (region) {
    glad_summary_table = GLAD_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${glad_summary_table}?sql=${
    QUERIES.gladIntersectionAlerts
  }`
    .replace('{location}', getLocation(country, region, subRegion))
    .replace('{polyname}', 'gadm28');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchGladIntersectionAlerts = ({ country, region, indicator }) => {
  const url = `${REQUEST_URL}/query/${
    region ? GLAD_ADM2_DATASET : GLAD_ADM1_DATASET
  }?sql=${QUERIES.gladIntersectionAlerts}`
    .replace('{location}', getLocation(country, region))
    .replace('{polyname}', indicator || 'gadm28');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchGLADLatest = () => {
  const url = `${REQUEST_URL}/glad-alerts/latest`;
  return request.get(url, 3600, 'gladRequest');
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
    .replace('{geostore}', subRegion && geostore ? geostore.hash : '')
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return request.get(url);
};
