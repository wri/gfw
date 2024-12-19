import { all, spread } from 'axios';

import { cartoRequest, dataRequest } from 'utils/request';
import { getGadm36Id } from 'utils/gadm';

import countryLinks from './country-links.json';

const SQL_QUERIES = {
  getCountries:
    "SELECT iso, name_engli as name FROM gadm36_countries WHERE iso != 'TWN' AND iso != 'XCA' ORDER BY name",
  getFAOCountries:
    'SELECT iso, country AS name FROM data WHERE 1 = 1 AND year = 2020',
  getRegions:
    "SELECT gid_1 as id, name_1 as name FROM gadm36_adm1 WHERE iso = '{iso}' ORDER BY name ",
  getSubRegions:
    "SELECT gid_2 as id, name_2 as name FROM gadm36_adm2 WHERE iso = '{iso}' AND gid_1 = '{adm1}' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body') ORDER BY name",
};

const convertToOptions = (countries) =>
  countries.map((c) => ({ label: c.name, value: c.iso }));

export const getCountriesProvider = () => {
  const url = `/sql?q=${SQL_QUERIES.getCountries}`;
  return cartoRequest.get(url);
};

export const getFAOCountriesProvider = () => {
  const url = `dataset/fao_forest_extent/v2020/query/json?sql=${SQL_QUERIES.getFAOCountries}`;
  return dataRequest.get(url);
};

export const getRegionsProvider = ({ adm0, token }) => {
  const url = `/sql?q=${SQL_QUERIES.getRegions}`.replace('{iso}', adm0);
  return cartoRequest.get(url, { cancelToken: token });
};

export const getSubRegionsProvider = (adm0, adm1, token) => {
  const url = `/sql?q=${SQL_QUERIES.getSubRegions}`
    .replace('{iso}', adm0)
    .replace('{adm1}', getGadm36Id(adm0, adm1));
  return cartoRequest.get(url, { cancelToken: token });
};

export const getCountryLinksProvider = () => {
  // hard coded list
  return new Promise((resolve) => {
    resolve(countryLinks);
  });
};

export const getCountryLinksSerialized = async () => {
  const response = await getCountryLinksProvider();

  if (response?.rows?.length) {
    const data = {};
    response.rows.forEach((d) => {
      data[d.iso] = JSON.parse(d.external_links);
    });
    return data;
  }
  return {};
};

export const getCategorisedCountries = (asOptions = false) =>
  all([getCountriesProvider(), getFAOCountriesProvider()]).then(
    spread((gadm36Countries, faoCountries) => {
      return {
        gadmCountries: asOptions
          ? convertToOptions(gadm36Countries.data.rows)
          : gadm36Countries.data.rows,
        faoCountries: asOptions
          ? convertToOptions(faoCountries.data)
          : faoCountries.data,
        countries: asOptions
          ? convertToOptions(gadm36Countries.data.rows)
          : gadm36Countries.data.rows,
      };
    })
  );
