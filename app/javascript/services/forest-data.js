import request from 'utils/request';
import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';

const ADM0_DATASET = process.env.GADM36_ADM0_DATASET;
const ADM1_DATASET = process.env.GADM36_ADM1_DATASET;
const ADM2_DATASET = process.env.GADM36_ADM2_DATASET;

const REQUEST_URL = 'https://api.resourcewatch.org/query/{dataset}?sql=';
const CARTO_REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const NEW_SQL_QUERIES = {
  loss:
    'SELECT year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.carbon_emissions) as emissions FROM data {WHERE} GROUP BY nested(year_data.year)',
  lossTsc:
    'SELECT tcs as bound1, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.carbon_emissions) as emissions FROM data {WHERE} GROUP BY bound1, nested(year_data.year)',
  lossGrouped:
    'SELECT {location}, year_data.year as year, SUM(year_data.area_loss) as area_loss FROM data {WHERE} GROUP BY {location}, nested(year_data.year) ORDER BY {location}',
  extent:
    'SELECT SUM({extentYear}) as extent, SUM(total_area) as total_area FROM data {WHERE}',
  extentGrouped:
    'SELECT {location}, SUM({extentYear}) as extent, SUM(total_area) as total_area FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  gain: 'SELECT SUM(total_gain) as gain FROM data {WHERE}',
  gainGrouped:
    'SELECT {location}, SUM(total_gain) as gain, SUM(extent_2000) as extent FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  areaIntersection:
    'SELECT SUM(total_area) AS intersection_area, {location}, {intersection} FROM data {WHERE} GROUP BY {location}, {intersection} ORDER BY intersection_area DESC',
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
  nonGlobalDatasets: 'SELECT iso FROM data {WHERE} GROUP BY iso ORDER BY iso',
  globalLandCover: 'SELECT * FROM global_land_cover_adm2 WHERE {location}'
};

const ALLOWED_PARAMS = [
  'iso',
  'adm1',
  'adm2',
  'threshold',
  'forestType',
  'landCategory'
];

const CATEGORIZED_POLYNAMES = ['plantations', 'tcs', 'wdpa', 'ifl'];

// quyery building helpers
const getAdmDatasetId = (adm0, adm1, adm2, grouped) => {
  if (adm2 || (adm1 && grouped)) return ADM2_DATASET;
  if (adm1 || (adm0 && grouped)) return ADM1_DATASET;
  return ADM0_DATASET;
};

const getExtentYear = year => `extent_${year}`;

const getLocationSelect = ({ adm1, adm2 }) =>
  `iso${adm1 ? ', adm1' : ''}${adm2 ? ', adm2' : ''}`;

const getLocationSelectGrouped = ({ adm0, adm1 }) =>
  `iso${adm0 ? ', adm1' : ''}${adm1 ? ', adm2' : ''}`;

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0 ? `iso = '${adm0}'` : '1 = 1'}${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

const getRequestUrl = (adm0, adm1, adm2, grouped) =>
  REQUEST_URL.replace('{dataset}', getAdmDatasetId(adm0, adm1, adm2, grouped));

const getWHEREQuery = params => {
  const paramKeys = params && Object.keys(params);
  const paramKeysFiltered = paramKeys.filter(
    p => params[p] && ALLOWED_PARAMS.includes(p)
  );
  if (params) {
    let paramString = 'WHERE ';
    paramKeysFiltered.forEach((p, i) => {
      const isLast = paramKeysFiltered.length - 1 === i;
      const isPolyname = ['forestType', 'landCategory'].includes(p);
      const value = isPolyname ? 1 : params[p];
      let appendString = '';
      if (!CATEGORIZED_POLYNAMES.includes(params[p])) {
        appendString = `${isPolyname ? params[p] : p} = ${
          typeof value === 'number' ? value : `'${value}'`
        }${isLast ? '' : ' AND '}`;
      } else {
        appendString = `${params[p]} is not null${isLast ? '' : ' AND '}`;
      }
      paramString = paramString.concat(appendString);
    });
    return paramString;
  }
  return '';
};

const getIndicatorsFromData = () => {
  const allPolynames = forestTypes
    .concat(landCategories)
    .filter(p => !p.global);
  return allPolynames.reduce((obj, next) => ({ ...obj, [next.value]: 1 }), {});
};

// summed loss for single location
export const getLoss = ({ adm0, adm1, adm2, tsc, ...params }) => {
  const { loss, lossTsc } = NEW_SQL_QUERIES;
  const url = `${getRequestUrl(adm0, adm1, adm2)}${
    tsc ? lossTsc : loss
  }`.replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return request.get(url);
};

// disaggregated loss for child of location
export const getLossGrouped = ({ adm0, adm1, adm2, ...params }) => {
  const url = `${getRequestUrl(adm0, adm1, adm2, true)}${
    NEW_SQL_QUERIES.lossGrouped
  }`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return request.get(url);
};

// summed extent for single location
export const getExtent = ({ adm0, adm1, adm2, extentYear, ...params }) => {
  const url = `${getRequestUrl(adm0, adm1, adm2)}${NEW_SQL_QUERIES.extent}`
    .replace('{extentYear}', getExtentYear(extentYear))
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return request.get(url);
};

// disaggregated extent for child of location
export const getExtentGrouped = ({
  adm0,
  adm1,
  adm2,
  extentYear,
  ...params
}) => {
  const url = `${getRequestUrl(adm0, adm1, adm2, true)}${
    NEW_SQL_QUERIES.extentGrouped
  }`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace('{extentYear}', getExtentYear(extentYear))
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return request.get(url);
};

// total area for a given of polyname in location
export const getAreaIntersection = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  ...params
}) => {
  const url = `${getRequestUrl(adm0, adm1, adm2)}${
    NEW_SQL_QUERIES.areaIntersection
  }`
    .replace(/{location}/g, getLocationSelect({ adm0, adm1, adm2 }))
    .replace(/{intersection}/g, forestType || landCategory)
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return request.get(url);
};

// total area for a given of polyname in location
export const getAreaIntersectionGrouped = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  ...params
}) => {
  const url = `${getRequestUrl(adm0, adm1, adm2, true)}${
    NEW_SQL_QUERIES.areaIntersection
  }`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace(/{intersection}/g, forestType || landCategory)
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return request.get(url);
};

// summed gain for single location
export const getGain = ({ adm0, adm1, adm2, ...params }) => {
  const url = `${getRequestUrl(adm0, adm1, adm2)}${
    NEW_SQL_QUERIES.gain
  }`.replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));
  return request.get(url);
};

// disaggregated gain for child of location
export const getGainGrouped = ({ adm0, adm1, adm2, ...params }) => {
  const url = `${getRequestUrl(adm0, adm1, adm2, true)}${
    NEW_SQL_QUERIES.gainGrouped
  }`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace(
      '{WHERE}',
      getWHEREQuery({ iso: adm0, adm1, adm2, ...params, threshold: 0 })
    );

  return request.get(url);
};

export const getFAO = ({ adm0 }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.fao}`.replace(
    '{location}',
    adm0 ? `country = '${adm0}'` : '1 = 1'
  );
  return request.get(url);
};

export const getFAOExtent = ({ period }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoExtent}`.replace(
    '{period}',
    period
  );
  return request.get(url);
};

export const getFAODeforest = ({ adm0 }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoDeforest}`.replace(
    '{location}',
    adm0 ? `WHERE fao.country = '${adm0}'` : ''
  );
  return request.get(url);
};
export const getFAODeforestRank = ({ period }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoDeforestRank}`.replace(
    '{year}',
    period
  );
  return request.get(url);
};

export const getFAOEcoLive = () => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.faoEcoLive}`;
  return request.get(url);
};

export const getNonGlobalDatasets = () => {
  const url = `${getRequestUrl()}${NEW_SQL_QUERIES.nonGlobalDatasets}`.replace(
    '{WHERE}',
    getWHEREQuery(getIndicatorsFromData())
  );
  return request.get(url);
};

export const getGlobalLandCover = ({ adm0, adm1, adm2 }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.globalLandCover}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );
  return request.get(url);
};
