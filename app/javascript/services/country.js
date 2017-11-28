import axios from 'axios';

const APIURL = 'https://wri-01.carto.com/api/v2';

const APIURLS = {
  getCountries:
    '/sql?q=SELECT iso, country as name FROM umd_nat_staging GROUP BY iso, name ORDER BY name',
  getRegions:
    "/sql?q=SELECT id1 as id, region as name FROM umd_subnat_staging WHERE iso = '{iso}' and year = 2001 and thresh = 30 ORDER BY name ",
  getSubRegions:
    "/sql?q=SELECT id_2 as id, name_2 as name FROM gadm28_adm2 WHERE iso = '{iso}' AND id_1 = '{admin1}' ORDER BY name"
};

export const getCountriesProvider = () => {
  const url = `${APIURL}${APIURLS.getCountries}`;
  return axios.get(url);
};

export const getRegionsProvider = country => {
  const url = `${APIURL}${APIURLS.getRegions}`.replace('{iso}', country);
  return axios.get(url);
};

export const getSubRegionsProvider = (admin0, admin1) => {
  const url = `${APIURL}${APIURLS.getSubRegions}`
    .replace('{iso}', admin0)
    .replace('{admin1}', admin1);
  return axios.get(url);
};
