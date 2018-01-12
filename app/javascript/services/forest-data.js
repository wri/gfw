import axios from 'axios';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}/query/${DATASET}?sql=`;
const CARTO_REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  extent:
    "SELECT SUM({extentYear}) as value, SUM(area_gadm28) as total_area FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  gain:
    "SELECT {calc} as value FROM data WHERE {location} AND polyname = '{indicator}' AND thresh = {threshold}",
  loss:
    "SELECT sum(area) as area, sum(emissions) as emissions FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  locations:
    "SELECT {location}, {extent} as value, {area} as total_area FROM data WHERE iso = '{iso}' AND thresh = {threshold} AND polyname = '{polyname}' {grouping}",
  fao:
    "SELECT fao.iso, fao.name, forest_planted, forest_primary, forest_regenerated, fao.forest_primary, fao.extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary is not null AND fao.iso = '{country}' AND a.year = 2001 AND a.thresh = 30",
  faoExtent:
    "SELECT country AS iso, name, year, reforest AS rate, forest*1000 AS extent FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {period} AND fao.country = '{country}'"
};

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

const getLocationQuery = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const getExtent = ({
  country,
  region,
  subRegion,
  indicator,
  threshold,
  extentYear
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.extent}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator)
    .replace('{extentYear}', extentYear);
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

export const getFAO = ({ country }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.fao}`.replace(
    '{country}',
    country
  );
  return axios.get(url);
};

export const getFAOExtent = ({ country, period }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoExtent}`
    .replace('{country}', country)
    .replace('{period}', period);
  return axios.get(url);
};
