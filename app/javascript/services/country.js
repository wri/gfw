import axios from 'axios';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;
const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const WHITELIST_URL = `${process.env.GFW_API_HOST_PROD}/query/${DATASET}?sql=`;

const SQL_QUERIES = {
  getCountries:
    'SELECT iso, country as name FROM umd_nat_staging GROUP BY iso, name ORDER BY name',
  getRegions:
    "SELECT id1 as id, region as name FROM umd_subnat_staging WHERE iso = '{iso}' and year = 2001 and thresh = 30 ORDER BY name ",
  getSubRegions:
    "SELECT id_2 as id, name_2 as name FROM gadm28_adm2 WHERE iso = '{iso}' AND id_1 = '{admin1}' ORDER BY name",
  getWhitelists:
    "SELECT polyname FROM data WHERE thresh = 0 AND polyname is not 'gadm28' AND iso = '{iso}' GROUP BY polyname",
  getRanking:
    "WITH mytable AS (SELECT fao.iso, fao.name, fao.forest_primary, fao.extent forest_extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary > 0 AND a.year = 2001 AND a.thresh = 30), rank AS ( SELECT forest_extent * (forest_primary/100)/area_ha * 100 as percent_primary ,iso from mytable ORDER BY percent_primary DESC), item as (select percent_primary from rank where iso = '{country}') select count(*) as rank from rank WHERE percent_primary > (select percent_primary from item )"
};

export const getCountriesProvider = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountries}`;
  return axios.get(url);
};

export const getRegionsProvider = country => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRegions}`.replace(
    '{iso}',
    country
  );
  return axios.get(url);
};

export const getSubRegionsProvider = (admin0, admin1) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getSubRegions}`
    .replace('{iso}', admin0)
    .replace('{admin1}', admin1);
  return axios.get(url);
};

export const getWhitelistsProvider = admin0 => {
  const url = `${WHITELIST_URL}${SQL_QUERIES.getWhitelists}`.replace(
    '{iso}',
    admin0
  );
  return axios.get(url);
};

export const getRanking = ({ country }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRanking}`.replace(
    '{country}',
    country
  );
  return axios.get(url);
};
