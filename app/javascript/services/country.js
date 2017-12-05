import axios from 'axios';

const API_URL = process.env.CARTO_API_URL;

const SQL_QUERIES = {
  getCountries:
    '/sql?q=SELECT iso, country as name FROM umd_nat_staging GROUP BY iso, name ORDER BY name',
  getRegions:
    "/sql?q=SELECT id1 as id, region as name FROM umd_subnat_staging WHERE iso = '{iso}' and year = 2001 and thresh = 30 ORDER BY name ",
  getSubRegions:
    "/sql?q=SELECT id_2 as id, name_2 as name FROM gadm28_adm2 WHERE iso = '{iso}' AND id_1 = '{admin1}' ORDER BY name"
};

export const getCountriesProvider = () => {
  const url = `${API_URL}${SQL_QUERIES.getCountries}`;
  return axios.get(url);
};

export const getRegionsProvider = country => {
  const url = `${API_URL}${SQL_QUERIES.getRegions}`.replace('{iso}', country);
  return axios.get(url);
};

export const getSubRegionsProvider = (admin0, admin1) => {
  const url = `${API_URL}${SQL_QUERIES.getSubRegions}`
    .replace('{iso}', admin0)
    .replace('{admin1}', admin1);
  return axios.get(url);
};
