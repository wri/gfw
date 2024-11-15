import { all, spread } from 'axios';

import { cartoRequest, dataRequest } from 'utils/request';
import { getGadm36Id } from 'utils/gadm';

const GADM_DATASET = '/dataset/gadm_administrative_boundaries/v4.1/query';

const SQL_QUERIES = {
  getGADMCountries:
    "SELECT country AS name, gid_0 AS iso FROM gadm_administrative_boundaries WHERE adm_level = '0' ORDER BY country",
  getGADMRegions:
    "SELECT name_1 AS name, gid_1 AS id FROM gadm_administrative_boundaries WHERE adm_level='1' AND gid_0 = '{iso}' ORDER BY name ",
  getGADMSubRegions:
    "SELECT gid_2 as id, name_2 as name FROM gadm_administrative_boundaries WHERE gid_0 = '{iso}' AND gid_1 = '{adm1}' AND adm_level='2' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body') ORDER BY name",
  getFAOCountries:
    'SELECT DISTINCT country AS iso, name FROM table_1_forest_area_and_characteristics',
  getCountryLinks:
    'SELECT iso, external_links FROM external_links_gfw WHERE forest_atlas is true',
  getRanking:
    "WITH mytable AS (SELECT fao.iso, fao.name, fao.forest_primary, fao.extent forest_extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary > 0 AND a.year = 2001 AND a.thresh = 30), rank AS ( SELECT forest_extent * (forest_primary/100)/area_ha * 100 as percent_primary ,iso from mytable ORDER BY percent_primary DESC), item as (select percent_primary from rank where iso = '{adm0}') select count(*) as rank from rank WHERE percent_primary > (select percent_primary from item )",
};

const convertToOptions = (countries) =>
  countries.map((c) => ({ label: c.name, value: c.iso }));

export const getCountriesProvider = () => {
  const url = `${GADM_DATASET}?sql=${SQL_QUERIES.getGADMCountries}`;

  return dataRequest.get(url);
};

export const getFAOCountriesProvider = () => {
  const url = `/sql?q=${SQL_QUERIES.getFAOCountries}`;
  return cartoRequest.get(url);
};

export const getRegionsProvider = ({ adm0, token }) => {
  const url = `${GADM_DATASET}?sql=${SQL_QUERIES.getGADMRegions}`.replace(
    '{iso}',
    adm0
  );

  return dataRequest.get(url, { cancelToken: token });
};

export const getSubRegionsProvider = (adm0, adm1, token) => {
  const url = `${GADM_DATASET}?sql=${SQL_QUERIES.getGADMSubRegions}`
    .replace('{iso}', adm0)
    .replace('{adm1}', getGadm36Id(adm0, adm1));

  return dataRequest.get(url, { cancelToken: token });
};

export const getCountryLinksProvider = (token) => {
  const url = `/sql?q=${SQL_QUERIES.getCountryLinks}`;
  return cartoRequest.get(url, { cancelToken: token });
};

export const getRanking = ({ adm0, token }) => {
  const url = `/sql?q=${SQL_QUERIES.getRanking}`.replace('{adm0}', adm0);
  return cartoRequest.get(url, { cancelToken: token });
};

export const getCountryLinksSerialized = async () => {
  const response = await getCountryLinksProvider();
  if (response.data && response.data.rows.length) {
    const data = {};
    response.data.rows.forEach((d) => {
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
          ? convertToOptions(faoCountries.data.rows)
          : faoCountries.data.rows,
        countries: asOptions
          ? convertToOptions(gadm41Countries.data)
          : gadm41Countries.data,
      };
    })
  );
