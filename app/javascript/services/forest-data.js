import axios from 'axios';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const API_URL = process.env.GFW_API_HOST_PROD;
const REQUEST_URL = `${API_URL}/query/${DATASET}?sql=`;

const SQL_QUERIES = {
  extent:
    "SELECT SUM(area_extent) as value SUM(area_gadm28) as total_area, FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  gain:
    "SELECT {calc} as value FROM data WHERE {location} AND polyname = '{indicator}' AND thresh = {threshold}",
  loss:
    "SELECT polyname, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.emissions) as emissions FROM data WHERE polyname = '{indicator}' AND {location} AND thresh= {threshold} GROUP BY polyname, iso, nested(year_data.year)",
  locations:
    "SELECT {location}, {extent} as value, {area} as total_area FROM data WHERE iso = '{iso}' AND thresh = {threshold} AND polyname = '{polyname}' {grouping}"
};

const getLocationQuery = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const getLocations = ({ country, region, indicator, threshold }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locations}`
    .replace('{location}', region ? 'adm2' : 'adm1')
    .replace('{extent}', region ? 'area_extent' : 'sum(area_extent)')
    .replace('{area}', region ? 'area_gadm28' : 'sum(area_gadm28)')
    .replace('{iso}', country)
    .replace('{threshold}', threshold)
    .replace('{polyname}', indicator)
    .replace('{grouping}', region ? `AND adm1 = '${region}'` : 'GROUP BY adm1');
  return axios.get(url);
};

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

export const getGain = ({
  country,
  region,
  subRegion,
  indicator,
  threshold
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.gain}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{calc}', region ? 'area_gain' : 'SUM(area_gain)')
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
