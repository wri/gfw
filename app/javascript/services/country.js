import request from 'utils/request';
import { buildGadm36Id } from 'utils/format';

const REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const SQL_QUERIES = {
  getCountries:
    "SELECT iso, name_engli as name FROM gadm36_countries WHERE iso != 'TWN' AND iso != 'XCA' ORDER BY name",
  getFAOCountries:
    'SELECT DISTINCT country AS iso, name FROM table_1_forest_area_and_characteristics',
  getRegions:
    "SELECT gid_1 as id, name_1 as name FROM gadm36_adm1 WHERE iso = '{iso}' ORDER BY name ",
  getSubRegions:
    "SELECT gid_2 as id, name_2 as name FROM gadm36_adm2 WHERE iso = '{iso}' AND gid_1 = '{adm1}' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body') ORDER BY name",
  getCountryLinks:
    'SELECT iso, external_links FROM external_links_gfw WHERE forest_atlas is true',
  getRanking:
    "WITH mytable AS (SELECT fao.iso, fao.name, fao.forest_primary, fao.extent forest_extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary > 0 AND a.year = 2001 AND a.thresh = 30), rank AS ( SELECT forest_extent * (forest_primary/100)/area_ha * 100 as percent_primary ,iso from mytable ORDER BY percent_primary DESC), item as (select percent_primary from rank where iso = '{adm0}') select count(*) as rank from rank WHERE percent_primary > (select percent_primary from item )",
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

export const getRegionsProvider = ({ adm0, token }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRegions}`.replace('{iso}', adm0);
  return request.get(url, { cancelToken: token });
};

export const getSubRegionsProvider = (adm0, adm1, token) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getSubRegions}`
    .replace('{iso}', adm0)
    .replace('{adm1}', buildGadm36Id(adm0, adm1));
  return request.get(url, { cancelToken: token });
};

export const getCountryLinksProvider = token => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountryLinks}`;
  return request.get(url, { cancelToken: token });
};

export const getCountriesLatLng = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountriesLatLng}`;
  return request.get(url);
};

export const getRanking = ({ adm0, token }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRanking}`.replace('{adm0}', adm0);
  return request.get(url, { cancelToken: token });
};
