import axios from 'axios';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;
const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const WHITELIST_URL = `${process.env.GFW_API_HOST_PROD}/query/${DATASET}?sql=`;
const CARTO_REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  getCountries:
    'SELECT iso, country as name FROM umd_nat_staging GROUP BY iso, name ORDER BY name',
  getFAOCountries:
    'SELECT DISTINCT country AS iso, name FROM table_1_forest_area_and_characteristics',
  getRegions:
    "SELECT id1 as id, region as name FROM umd_subnat_staging WHERE iso = '{iso}' and year = 2001 and thresh = 30 ORDER BY name ",
  getSubRegions:
    "SELECT id_2 as id, name_2 as name FROM gadm28_adm2 WHERE iso = '{iso}' AND id_1 = '{admin1}' ORDER BY name",
  getCountryWhitelist:
    "SELECT polyname, SUM(area_extent_2000) as total_extent_2000, SUM(area_extent) as total_extent_2010, SUM(area_gain) as total_gain, SUM(year_data.area_loss) as total_loss FROM data WHERE thresh = 0 AND iso = '{iso}' GROUP BY polyname",
  getRegionWhitelist:
    'SELECT polyname, SUM(area_extent_2000) as total_extent_2000, SUM(area_extent) as total_extent_2010, SUM(area_gain) as total_gain, SUM(year_data.area_loss) as total_loss FROM data WHERE thresh = 0 AND {location} GROUP BY polyname',
  getCountryLinks:
    'SELECT iso, external_links FROM external_links_gfw WHERE forest_atlas is true',
  getRanking:
    "WITH mytable AS (SELECT fao.iso, fao.name, fao.forest_primary, fao.extent forest_extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary > 0 AND a.year = 2001 AND a.thresh = 30), rank AS ( SELECT forest_extent * (forest_primary/100)/area_ha * 100 as percent_primary ,iso from mytable ORDER BY percent_primary DESC), item as (select percent_primary from rank where iso = '{country}') select count(*) as rank from rank WHERE percent_primary > (select percent_primary from item )"
};

const getLocationQuery = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const getCountriesProvider = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountries}`;
  return axios.get(url);
};

export const getFAOCountriesProvider = () => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.getFAOCountries}`;
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

export const getCountryWhitelistProvider = admin0 => {
  const url = `${WHITELIST_URL}${SQL_QUERIES.getCountryWhitelist}`.replace(
    '{iso}',
    admin0
  );
  return axios.get(url);
};

export const getRegionWhitelistProvider = (admin0, admin1, admin2) => {
  const url = `${WHITELIST_URL}${SQL_QUERIES.getRegionWhitelist}`.replace(
    '{location}',
    getLocationQuery(admin0, admin1, admin2)
  );
  return axios.get(url);
};

export const getCountryLinksProvider = () => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.getCountryLinks}`;
  return axios.get(url);
};

export const getRanking = ({ country }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRanking}`.replace(
    '{country}',
    country
  );
  return axios.get(url);
};
