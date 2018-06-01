import request from 'utils/request';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  getCountries:
    'SELECT iso, country as name FROM umd_nat_staging GROUP BY iso, name ORDER BY name',
  getFAOCountries:
    'SELECT DISTINCT country AS iso, name FROM table_1_forest_area_and_characteristics',
  getRegions:
    "SELECT id_1 as id, name_1 as name FROM gadm28_adm1 WHERE iso = '{iso}' ORDER BY name ",
  getSubRegions:
    "SELECT id_2 as id, name_2 as name FROM gadm28_adm2 WHERE iso = '{iso}' AND id_1 = '{admin1}' ORDER BY name",
  getCountryLinks:
    'SELECT iso, external_links FROM external_links_gfw WHERE forest_atlas is true',
  getRanking:
    "WITH mytable AS (SELECT fao.iso, fao.name, fao.forest_primary, fao.extent forest_extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary > 0 AND a.year = 2001 AND a.thresh = 30), rank AS ( SELECT forest_extent * (forest_primary/100)/area_ha * 100 as percent_primary ,iso from mytable ORDER BY percent_primary DESC), item as (select percent_primary from rank where iso = '{country}') select count(*) as rank from rank WHERE percent_primary > (select percent_primary from item )",
  getCountriesLatLng:
    'SELECT latitude_average, longitude_average, alpha_3_code as iso FROM country_list_iso_3166_codes_latitude_longitude'
};

export const getCountriesProvider = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountries}`;
  return request.get(url);
};

export const getFAOCountriesProvider = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getFAOCountries}`;
  return request.get(url);
};

export const getRegionsProvider = country => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRegions}`.replace(
    '{iso}',
    country
  );
  return request.get(url);
};

export const getSubRegionsProvider = (admin0, admin1) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getSubRegions}`
    .replace('{iso}', admin0)
    .replace('{admin1}', admin1);
  return request.get(url);
};

export const getCountryLinksProvider = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountryLinks}`;
  return request.get(url);
};

export const getCountriesLatLng = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountriesLatLng}`;
  return request.get(url);
};

export const getRanking = ({ country }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRanking}`.replace(
    '{country}',
    country
  );
  return request.get(url);
};
