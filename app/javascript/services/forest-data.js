import axios from 'axios';

const CARTO_REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const NEW_SQL_QUERIES = {
  fao:
    'SELECT country AS iso, name, plantfor * 1000 AS planted_forest, primfor * 1000 AS forest_primary, natregfor * 1000 AS forest_regenerated, forest * 1000 AS extent, totarea as area_ha FROM table_1_forest_area_and_characteristics WHERE {location} AND year = 2015',
  faoExtent:
    'SELECT country AS iso, name, year, reforest * 1000 AS rate, forest*1000 AS extent FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {period} AND reforest > 0 ORDER BY rate DESC',
  faoDeforest:
    'SELECT fao.country, fao.name, fao.deforest * 1000 AS deforest, fao.humdef, fao.year FROM table_1_forest_area_and_characteristics as fao {location}',
  faoDeforestRank:
    'WITH mytable AS (SELECT fao.country as iso, fao.name, fao.deforest * 1000 AS deforest, fao.humdef FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {year} AND deforest is not null), rank AS (SELECT deforest, iso, name from mytable ORDER BY mytable.deforest DESC) SELECT row_number() over () as rank, iso, name, deforest from rank',
  faoEcoLive:
    'SELECT fao.country, fao.forempl, fao.femempl, fao.usdrev, fao.usdexp, fao.gdpusd2012, fao.totpop1000, fao.year FROM table_7_economics_livelihood as fao WHERE fao.year = 2000 or fao.year = 2005 or fao.year = 2010 or fao.year = 9999',
  globalLandCover: 'SELECT * FROM global_land_cover_adm2 WHERE {location}',
  getNLCDLandCover:
    'SELECT {select} FROM nlcd_land_cover WHERE from_year = {startYear} AND to_year = {endYear} {adm} {groupby}'
};

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0 ? `iso = '${adm0}'` : '1 = 1'}${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const getFAO = ({ adm0, token }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.fao}`.replace(
    '{location}',
    adm0 ? `country = '${adm0}'` : '1 = 1'
  );
  return axios.get(url, { cancelToken: token });
};

export const getFAOExtent = ({ period, token }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoExtent}`.replace(
    '{period}',
    period
  );
  return axios.get(url, { cancelToken: token });
};

export const getFAODeforest = ({ adm0, token }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoDeforest}`.replace(
    '{location}',
    adm0 ? `WHERE fao.country = '${adm0}'` : ''
  );
  return axios.get(url, { cancelToken: token });
};
export const getFAODeforestRank = ({ period, token }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoDeforestRank}`.replace(
    '{year}',
    period
  );
  return axios.get(url, { cancelToken: token });
};

export const getFAOEcoLive = token => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoEcoLive}`;
  return axios.get(url, { cancelToken: token });
};

export const getGlobalLandCover = ({ adm0, adm1, adm2, token }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.globalLandCover}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );
  return axios.get(url, { cancelToken: token });
};

export const getUSLandCover = params => {
  const { adm0, adm1, adm2, startYear, endYear, download } = params;
  let admQuery = '';
  if (adm1 && !adm2) {
    // adm1
    admQuery = `AND adm1 = ${adm1}`;
  } else if (adm1 && adm2) {
    // adm 2
    admQuery = `AND adm1 = ${adm1} AND adm2 = ${adm2}`;
  }
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.getNLCDLandCover}`
    .replace(
      '{select}',
      adm2
        ? '*, class_area as area'
        : 'SUM(class_area) as area, to_class_ipcc, from_class_nlcd, to_class_nlcd, from_class_ipcc'
    )
    .replace('{startYear}', startYear)
    .replace('{endYear}', endYear)
    .replace('{adm}', admQuery)
    .replace(
      '{groupby}',
      adm2
        ? ''
        : 'GROUP BY to_class_ipcc, from_class_nlcd, to_class_nlcd, from_class_ipcc'
    );

  if (download) {
    return url.concat(
      `&format=csv&filename=land_cover_in_ha_in_${adm0}${
        adm1 ? `_${adm1}` : ''
      }${adm2 ? `_${adm2}` : ''}_from_${startYear}_to_${endYear}`
    );
  }
  return axios.get(url);
};
