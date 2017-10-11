import axios from 'axios';

const CONFIG = {
  countriesConfigDataset: '134caa0a-21f7-451d-a7fe-30db31a424aa',
  countriesConfigTable: 'gfw_countries_config',
  countriesDataset: '134caa0a-21f7-451d-a7fe-30db31a424aa',
  countriesTable: 'gadm28_countries',
  regionsDataset: '098b33df-6871-4e53-a5ff-b56a7d989f9a',
  regionsTable: 'gadm28_adm1',
  subRegionsDataset: 'b3d076cc-b150-4ccb-a93e-eca05d9ac2bf',
  subRegionsTable: 'gadm28_adm2'
};

const OLD_APIURL = process.env.GFW_API_HOST;
const APIURL = process.env.GFW_API_HOST_PROD;

const APIURLS = {
  'getCountriesList': '/query/{countriesDataset}?sql=SELECT name_engli as name, iso FROM {countriesTable}',
  'getCountry': '/countries/{iso}?thresh=30',
  'getCountryRegions': '/query/{regionsDataset}?sql=SELECT cartodb_id, iso, area_ha, bbox as bounds, id_1 as id, name_1 as name FROM {regionsTable} WHERE iso=\'{iso}\' ORDER BY name',
};

export const getCountriesList = () => {
  const url = `${APIURL}${APIURLS.getCountriesList}`
    .replace('{countriesDataset}', CONFIG.countriesDataset)
    .replace('{countriesTable}', CONFIG.countriesTable);
  return axios.get(url);
};

export const getCountry = (iso) => {
  const url = `${OLD_APIURL}${APIURLS.getCountry}`
    .replace('{iso}', iso);
  return axios.get(url);
};

export const getCountryRegions = (iso) => {
  const url = `${APIURL}${APIURLS.getCountryRegions}`
    .replace('{regionsDataset}', CONFIG.regionsDataset)
    .replace('{regionsTable}', CONFIG.regionsTable)
    .replace('{iso}', iso);
  return axios.get(url);
};
