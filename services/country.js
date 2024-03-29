import { all, spread } from 'axios';

import { cartoRequest } from 'utils/request';
import { getGadm36Id } from 'utils/gadm';

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
};

const convertToOptions = (countries) =>
  countries.map((c) => ({ label: c.name, value: c.iso }));

export const getCountriesProvider = () => {
  const url = `/sql?q=${SQL_QUERIES.getCountries}`;
  return cartoRequest.get(url);
};

export const getFAOCountriesProvider = () => {
  const url = `/sql?q=${SQL_QUERIES.getFAOCountries}`;
  return cartoRequest.get(url);
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
    spread((gadm36Countries, faoCountries) => {
      return {
        gadmCountries: asOptions
          ? convertToOptions(gadm36Countries.data.rows)
          : gadm36Countries.data.rows,
        faoCountries: asOptions
          ? convertToOptions(faoCountries.data.rows)
          : faoCountries.data.rows,
        countries: asOptions
          ? convertToOptions(gadm36Countries.data.rows)
          : gadm36Countries.data.rows,
      };
    })
  );
