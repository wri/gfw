import axios from 'axios';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}/query/${DATASET}?sql=`;
const CARTO_REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  extent:
    "SELECT SUM({extentYear}) as value, SUM(area_gadm28) as total_area FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  gain:
    "SELECT {calc} as value FROM data WHERE {location} AND polyname = '{indicator}' AND thresh = {threshold}",
  gainRanking:
    "SELECT {region} as region, SUM(area_gain) AS gain, SUM({extentYear}) AS extent FROM data WHERE {location} AND polyname = '{polyname}' AND extent <> -9999 AND thresh = 0 GROUP BY region",
  loss:
    "SELECT polyname, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.emissions) as emissions FROM data WHERE polyname = '{indicator}' AND {location} AND thresh= {threshold} GROUP BY polyname, iso, nested(year_data.year)",
  locations:
    "SELECT {location}, {extent} as value, {area} as total_area FROM data WHERE iso = '{iso}' AND thresh = {threshold} AND polyname = '{polyname}' {grouping}",
  fao:
    "SELECT fao.iso, fao.name, forest_planted, forest_primary, forest_regenerated, fao.forest_primary, fao.extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary is not null AND fao.iso = '{country}' AND a.year = 2001 AND a.thresh = 30",
  faoExtent:
    'SELECT country AS iso, name, year, reforest AS rate, forest*1000 AS extent FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {period} AND reforest > 0 ORDER BY rate DESC'
};

const getLocationQuery = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

const getRankingLocationQuery = (country, region, subRegion) =>
  `${
    region
      ? `iso = '${country}' ${subRegion ? `AND adm1 = ${region}` : ''}`
      : '1 = 1'
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
  threshold,
  extentYear
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.extent}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator)
    .replace(
      '{extentYear}',
      `area_extent${extentYear === 2000 ? `_${extentYear}` : ''}`
    );
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

export const getFAOExtent = ({ period }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoExtent}`.replace(
    '{period}',
    period
  );
  return axios.get(url);
};

export const getGainRanking = ({
  country,
  region,
  subRegion,
  indicator,
  extentYear
}) => {
  let regionValue = 'iso';
  if (subRegion) {
    regionValue = 'adm2';
  } else if (region) {
    regionValue = 'adm1';
  }

  const url = `${REQUEST_URL}${SQL_QUERIES.gainRanking}`
    .replace('{region}', regionValue)
    .replace('{location}', getRankingLocationQuery(country, region, subRegion))
    .replace(
      '{extentYear}',
      extentYear === 2000 ? 'area_extent_2000' : 'area_extent'
    )
    .replace('{polyname}', indicator);
  return axios.get(url);
};
