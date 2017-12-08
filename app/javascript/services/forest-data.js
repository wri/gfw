import axios from 'axios';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const API_URL = process.env.GFW_API_HOST_PROD;
const REQUEST_URL = `${API_URL}/query/${DATASET}?sql=`;
const SQL_QUERIES = {
  extent:
    "SELECT SUM(area_extent) as value FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  gain:
    "SELECT SUM(area) as value FROM data WHERE {location} AND polyname = '{indicator}'",
  loss:
    "SELECT sum(area) as area, sum(emissions) as emissions FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  locations:
    "SELECT area_extent as value FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'"
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

export const getLocations = ({
  country,
  region,
  subRegion,
  indicator,
  threshold
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locations}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator);
  return axios.get(url);
};
