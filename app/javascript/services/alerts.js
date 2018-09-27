import request from 'utils/request';
import { getIndicator } from 'utils/strings';

const REQUEST_URL = process.env.GFW_API;
const CARTO_API = process.env.CARTO_API;
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
  terraAlerts:
    'SELECT day, year FROM data ORDER BY year DESC, day DESC LIMIT 1',
  sadAlerts: 'SELECT max(date) as date FROM imazon_sad',
  granChaco: 'SELECT max(date) as date FROM gran_chaco_deforestation',
  viirsAlerts: '{location}?group=true&period={period}&thresh=0',
  firesStats:
    '{location}?period={period}&aggregate_by=day&aggregate_values=true&fire_type=viirs'
};

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}`;

const getLocation = (adm0, adm1, adm2) =>
  `iso = '${adm0}'${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const fetchGladAlerts = ({ adm0, adm1, adm2 }) => {
  let glad_summary_table = GLAD_ISO_DATASET;
  if (adm2) {
    glad_summary_table = GLAD_ADM2_DATASET;
  } else if (adm1) {
    glad_summary_table = GLAD_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${glad_summary_table}?sql=${
    QUERIES.gladIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchGladIntersectionAlerts = ({
  adm0,
  adm1,
  forestType,
  landCategory
}) => {
  const url = `${REQUEST_URL}/query/${
    adm1 ? GLAD_ADM2_DATASET : GLAD_ADM1_DATASET
  }?sql=${QUERIES.gladIntersectionAlerts}`
    .replace('{location}', getLocation(adm0, adm1))
    .replace('{polyname}', getIndicator(forestType, landCategory));
  return request.get(url, 3600, 'gladRequest');
};

export const fetchFiresAlerts = ({ adm0, adm1, adm2, dataset }) => {
  let fires_summary_table = FIRES_ISO_DATASET;
  if (adm2) {
    fires_summary_table = FIRES_ADM2_DATASET;
  } else if (adm1) {
    fires_summary_table = FIRES_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${fires_summary_table}?sql=${
    QUERIES.firesIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin')
    .replace('{dataset}', dataset);
  return request.get(url, 3600, 'firesRequest');
};

export const fetchViirsAlerts = ({ adm0, adm1, adm2, dates }) => {
  const url = `${REQUEST_URL}/viirs-active-fires/${!adm2 ? 'admin/' : ''}${
    QUERIES.viirsAlerts
  }`
    .replace('{location}', !adm2 ? getLocationQuery(adm0, adm1, adm2) : '')
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return request.get(url);
};

export const fetchFiresStats = ({ adm0, adm1, adm2, dates }) => {
  const url = `${REQUEST_URL}/fire-alerts/summary-stats/admin/${
    QUERIES.firesStats
  }`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return request.get(url);
};

// Latest Dates for Alerts

export const fetchGLADLatest = () => {
  const url = `${REQUEST_URL}/glad-alerts/latest`;
  return request.get(url, 3600, 'gladRequest');
};

export const fetchFormaLatest = () => {
  const url = 'https://api-dot-forma-250.appspot.com/tiles/latest';
  return request.get(url, 3600, 'formaRequest');
};

export const fetchTerraLatest = () => {
  const url = `https://production-api.globalforestwatch.org/query/bb80312e-b514-48ad-9252-336408603591/?sql=${
    QUERIES.terraAlerts
  }`;
  return request.get(url, 3600, 'terraRequest');
};

export const fetchSADLatest = () => {
  const url = `${CARTO_API}/sql?q=${QUERIES.sadAlerts}`;
  return request.get(url, 3600, 'sadRequest');
};

export const fetchGranChacoLatest = () => {
  const url = `${CARTO_API}/sql?q=${QUERIES.granChaco}`;
  return request.get(url, 3600, 'granChacoRequest');
};
