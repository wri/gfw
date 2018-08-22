import request from 'utils/request';
import { getIndicator } from 'utils/strings';

const REQUEST_URL = process.env.GFW_API;
const GLAD_ISO_DATASET = process.env.GLAD_ISO_DATASET;
const GLAD_ADM1_DATASET = process.env.GLAD_ADM1_DATASET;
const GLAD_ADM2_DATASET = process.env.GLAD_ADM2_DATASET;
const FIRES_ISO_DATASET = process.env.FIRES_ISO_DATASET;
const FIRES_ADM1_DATASET = process.env.FIRES_ADM1_DATASET;
const FIRES_ADM2_DATASET = process.env.FIRES_ADM2_DATASET;

const QUERIES = {
  gladIntersectionAlerts:
    "SELECT iso, adm1, adm2, week, year, alerts as count, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}'",
  firesIntersectionAlerts:
    "SELECT iso, adm1, adm2, week, year, alerts as count, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}' AND fire_type = '{dataset}'",
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
    .replace('{polyname}', 'admin');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchGladIntersectionAlerts = ({
  country,
  region,
  forestType,
  landCategory
}) => {
  const url = `${REQUEST_URL}/query/${
    region ? GLAD_ADM2_DATASET : GLAD_ADM1_DATASET
  }?sql=${QUERIES.gladIntersectionAlerts}`
    .replace('{location}', getLocation(country, region))
    .replace('{polyname}', getIndicator(forestType, landCategory));
  return request.get(url, 3600, 'gladRequest');
};

export const fetchGLADLatest = () => {
  const url = `${REQUEST_URL}/glad-alerts/latest`;
  return request.get(url, 3600, 'gladRequest');
};

export const fetchFormaLatest = () => {
  const url = 'https://api-dot-forma-250.appspot.com/tiles/latest';
  return request.get(url, 3600, 'formaRequest');
};

export const fetchFiresAlerts = ({ country, region, subRegion, dataset }) => {
  let fires_summary_table = FIRES_ISO_DATASET;
  if (subRegion) {
    fires_summary_table = FIRES_ADM2_DATASET;
  } else if (region) {
    fires_summary_table = FIRES_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${fires_summary_table}?sql=${
    QUERIES.firesIntersectionAlerts
  }`
    .replace('{location}', getLocation(country, region, subRegion))
    .replace('{polyname}', 'admin')
    .replace('{dataset}', dataset);
  return request.get(url, 3600, 'firesRequest');
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
