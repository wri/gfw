import { all, spread } from 'axios';

import { dataRequest } from 'utils/request';
import { getGadmId } from 'utils/gadm';

import countryLinks from './country-links.json';

export const GADM_DATASET =
  '/dataset/gadm_administrative_boundaries/v4.1/query';

export const SQL_QUERIES = {
  getGADMCountries:
    "SELECT country AS name, gid_0 AS iso FROM gadm_administrative_boundaries WHERE adm_level = '0' ORDER BY country",
  getGADMRegions:
    "SELECT name_1 AS name, gid_1 AS id FROM gadm_administrative_boundaries WHERE adm_level='1' AND gid_0 = '{iso}' ORDER BY name ",
  getGADMSubRegions:
    "SELECT gid_2 as id, name_2 as name FROM gadm_administrative_boundaries WHERE gid_0 = '{iso}' AND gid_1 = '{adm1}' AND adm_level='2' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body') ORDER BY name",
  getFAOCountries:
    'SELECT iso, country AS name FROM data WHERE 1 = 1 AND year = 2020',
};

const convertToOptions = (countries) =>
  countries.map((c) => ({ label: c.name, value: c.iso }));

export const getCountriesProvider = () => {
  const url = `${GADM_DATASET}?sql=${SQL_QUERIES.getGADMCountries}`;

  return dataRequest.get(url);
};

export const getFAOCountriesProvider = () => {
  const url = `dataset/fao_forest_extent/v2020/query/json?sql=${SQL_QUERIES.getFAOCountries}`;
  return dataRequest.get(url);
};

export const getRegionsProvider = ({ adm0, token }) => {
  const url = `${GADM_DATASET}?sql=${SQL_QUERIES.getGADMRegions}`.replace(
    '{iso}',
    adm0
  );

  return dataRequest.get(url, { cancelToken: token });
};

export const getSubRegionsProvider = ({ adm0, adm1, token }) => {
  const url = `${GADM_DATASET}?sql=${SQL_QUERIES.getGADMSubRegions}`
    .replace('{iso}', adm0)
    .replace('{adm1}', getGadmId(adm0, adm1));

  return dataRequest.get(url, { cancelToken: token });
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
    spread((gadm41Countries, faoCountries) => {
      return {
        gadmCountries: asOptions
          ? convertToOptions(gadm41Countries.data)
          : gadm41Countries.data,
        faoCountries: asOptions
          ? convertToOptions(faoCountries.data)
          : faoCountries.data,
        countries: asOptions
          ? convertToOptions(gadm41Countries.data)
          : gadm41Countries.data,
      };
    })
  );
