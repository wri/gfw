import axios from 'axios';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const API_URL = process.env.GFW_API_HOST_PROD;
const REQUEST_URL = `${API_URL}/query/${DATASET}?sql=`;

const SQL_QUERIES = {
  extent:
    "SELECT SUM(area_extent) as value SUM(area_gadm28) as total_area, FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  gain:
    "SELECT SUM(area) as value FROM data WHERE {location} AND polyname = '{indicator}'",
  loss:
    "SELECT sum(area) as area, sum(emissions) as emissions FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  locations:
    "SELECT {location}, {calc1} as value, {calc2} as total_area FROM data WHERE iso = '{iso}' AND thresh = {threshold} AND polyname = '{polyname}' {grouping}"
};

export const getLocations = ({ country, region, indicator, threshold }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locations}`
    .replace('{location}', region ? 'adm2' : 'adm1')
    .replace('{calc1}', region ? 'area_gadm28' : 'sum(area_gadm28)')
    .replace('{calc2}', region ? 'area_gadm28' : 'sum(area_gadm28)')
    .replace('{iso}', country)
    .replace('{threshold}', threshold)
    .replace('{polyname}', indicator)
    .replace('{grouping}', region ? `AND adm1 = '${region}'` : 'GROUP BY adm1')
    .replace('{ds}', DATASET);
  return axios.get(url);
};

const getLocationQuery = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const getExtent = ({
  country,
  region,
  subRegion,
  indicator,
  threshold
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.extent}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator);
  return axios.get(url);
};

export const getGain = ({ country, region, subRegion, indicator }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.gain}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{indicator}', indicator);
  return axios.get(url);
};

export const getLoss = ({
  country,
  region,
  subRegion,
  indicator,
  threshold
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.loss}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator);
  return axios.get(url);
};
