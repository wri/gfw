import request from 'utils/request';
import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';
import { getIndicator } from 'utils/strings';

const ADM0_DATASET = process.env.GADM36_ADM0_DATASET;
const ADM1_DATASET = process.env.GADM36_ADM1_DATASET;
const ADM2_DATASET = process.env.GADM36_ADM2_DATASET;

const CARTO_REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const NEW_SQL_QUERIES = {
  loss:
    'SELECT year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.carbon_emissions) as emissions FROM data {WHERE} GROUP BY nested(year_data.year)',
  lossTsc:
    'SELECT tcs as bound1, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.carbon_emissions) as emissions FROM data {WHERE} GROUP BY bound1, nested(year_data.year)',
  lossGrouped:
    'SELECT {location}, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.carbon_emissions) as emissions FROM data {WHERE} GROUP BY {location}, nested(year_data.year) ORDER BY {location}',
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
  nonGlobalDatasets:
    'SELECT {polynames} FROM polyname_whitelist WHERE iso is null AND adm1 is null AND adm2 is null',
  globalLandCover: 'SELECT * FROM global_land_cover_adm2 WHERE {location}',
  getLocationPolynameWhitelist:
    'SELECT {location}, {polynames} FROM polyname_whitelist {WHERE} GROUP BY {location}',
  getNLCDLandCover:
    'SELECT {select} FROM nlcd_land_cover WHERE from_year = {from_year} AND to_year = {to_year} {adm} {groupby}'
};

const ALLOWED_PARAMS = [
  'iso',
  'adm1',
  'adm2',
  'threshold',
  'forestType',
  'landCategory'
];

// quyery building helpers
const getAdmDatasetId = (adm0, adm1, adm2, grouped) => {
  if (adm2 || (adm1 && grouped)) return ADM2_DATASET;
  if (adm1 || (adm0 && grouped)) return ADM1_DATASET;
  return ADM0_DATASET;
};

const getExtentYear = year => `extent_${year || 2010}`;

const getLocationSelect = ({ adm1, adm2 }) =>
  `iso${adm1 ? ', adm1' : ''}${adm2 ? ', adm2' : ''}`;

const getLocationSelectGrouped = ({ adm0, adm1 }) =>
  `iso${adm0 ? ', adm1' : ''}${adm1 ? ', adm2' : ''}`;

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0 ? `iso = '${adm0}'` : '1 = 1'}${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

const buildPolynameSelects = () => {
  const allPolynames = forestTypes
    .concat(landCategories)
    .filter(p => !p.hidden);
  let polyString = '';
  allPolynames.forEach((p, i) => {
    const isLast = i === allPolynames.length - 1;
    polyString = polyString.concat(
      `sum(${p.value}) as ${p.value}${isLast ? '' : ', '}`
    );
  });

  return polyString;
};

const getRequestUrl = (adm0, adm1, adm2, grouped) => {
  const dataset = getAdmDatasetId(adm0, adm1, adm2, grouped);
  const REQUEST_URL = `${process.env.GFW_API}/query/{dataset}?sql=`;
  return REQUEST_URL.replace('{dataset}', dataset);
};

const getWHEREQuery = params => {
  const allPolynames = forestTypes
    .concat(landCategories)
    .filter(p => !p.hidden);
  const paramKeys = params && Object.keys(params);
  const paramKeysFiltered = paramKeys.filter(
    p => (params[p] || p === 'threshold') && ALLOWED_PARAMS.includes(p)
  );

  if (params) {
    let paramString = 'WHERE ';
    paramKeysFiltered.forEach((p, i) => {
      const isLast = paramKeysFiltered.length - 1 === i;
      const isPolyname = ['forestType', 'landCategory'].includes(p);
      const value = isPolyname ? 1 : params[p];
      const polynameMeta = allPolynames.find(
        pname => pname.value === params[p]
      );

      const polynameString = `
        ${isPolyname ? `${params[p]} is not "0"` : ''}${
  isPolyname &&
        polynameMeta &&
        polynameMeta.default &&
        polynameMeta.categories
    ? ` AND ${params[p]} ${polynameMeta.comparison || '='} '${
      polynameMeta.default
    }'`
    : ''
}${
  !isPolyname
    ? `${p} = ${typeof value === 'number' ? value : `'${value}'`}`
    : ''
}${isLast ? '' : ' AND '}`;

      paramString = paramString.concat(polynameString);
    });
    return paramString;
  }
  return '';
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
    .replace(
      '{WHERE}',
      getWHEREQuery({
        iso: adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ...params
      })
    );

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
    .replace(
      '{WHERE}',
      getWHEREQuery({
        iso: adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ...params
      })
    );

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
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));
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
  const url = `${CARTO_REQUEST_URL}${
    NEW_SQL_QUERIES.nonGlobalDatasets
  }`.replace('{polynames}', buildPolynameSelects());
  return request.get(url);
};

export const getGlobalLandCover = ({ adm0, adm1, adm2 }) => {
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.globalLandCover}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );
  return request.get(url);
};

export const getLocationPolynameWhitelist = ({ adm0, adm1, adm2 }) => {
  const url = `${CARTO_REQUEST_URL}${
    NEW_SQL_QUERIES.getLocationPolynameWhitelist
  }`
    .replace(/{location}/g, getLocationSelect({ adm0, adm1, adm2 }))
    .replace('{polynames}', buildPolynameSelects())
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2 }));
  return request.get(url);
};

// OLD TABLE FETCHES PRE 2018 DATA

const REQUEST_URL_OLD = `${process.env.GFW_API}/query/${
  process.env.COUNTRIES_PAGE_DATASET
}?sql=`;

const SQL_QUERIES_OLD = {
  extent:
    "SELECT SUM({extentYear}) as value, SUM(area_admin) as total_area FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  loss:
    "SELECT bound1, polyname, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.emissions) as emissions FROM data WHERE {location} AND polyname = '{indicator}' AND thresh= {threshold} GROUP BY bound1, polyname, iso, nested(year_data.year)"
};

const getExtentYearOld = year =>
  (year === 2000 ? 'area_extent_2000' : 'area_extent');

export const getExtentOld = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  threshold,
  extentYear
}) => {
  const url = `${REQUEST_URL_OLD}${SQL_QUERIES_OLD.extent}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory))
    .replace('{extentYear}', getExtentYearOld(extentYear));
  return request.get(url);
};

export const getLossOld = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  threshold
}) => {
  const url = `${REQUEST_URL_OLD}${SQL_QUERIES_OLD.loss}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory));
  return request.get(url);
};

/*
export const getUSLandCover = () => ({
  adm1,
  adm2,
  from_year,
  to_year
}) => {
  let admQuery;
  if (adm1 && !adm2) { // adm1
    admQuery = `AND adm1 = ${adm1}`;
  } else if (adm1 && adm2) { // adm 2
    admQuery = `AND adm1 = ${adm1} AND adm2 = ${adm2}`;
  }
  const url = `${CARTO_REQUEST_URL}${NEW_SQL_QUERIES.fao}`
    .replace(
      '{select}',
      adm2 ? '*' : 'SUM(class_area) as area, to_class_ipcc, from_class_nlcd, to_class_nlcd, from_class_ipcc'
    )
    .replace(
      '{from_year}',
      from_year
    )
    .replace(
      '{to_year}',
      to_year
    )
    .replace(
      '{adm}',
      admQuery
    )
    .replace(
      'groupby',
      adm2 ? '' : 'GROUP BY to_class_ipcc, from_class_nlcd, to_class_nlcd, from_class_ipcc'
    );
  return request.get(url);
};
*/

export const getUSLandCover = () =>
  // example data
  [
    {
      area: 264597.5079113328,
      end: 'forest',
      perc_area: 62.262663899143405,
      start: 'forest'
    },
    {
      area: 50077.376769689494,
      end: 'bare',
      perc_area: 11.78374998076997,
      start: 'bare'
    },
    {
      area: 34909.6335643951,
      end: 'grassland',
      perc_area: 8.214615468678394,
      start: 'forest'
    },
    {
      area: 21756.6296452934,
      end: 'grassland',
      perc_area: 5.119570966015979,
      start: 'bare'
    },
    {
      area: 25595.3904281466,
      end: 'settlements',
      perc_area: 6.022873020138479,
      start: 'settlements'
    },
    {
      area: 11132.3076129296,
      end: 'cropland',
      perc_area: 2.619552741811838,
      start: 'cropland'
    },
    {
      area: 5289.8825873843,
      end: 'grassland',
      perc_area: 1.2447667561351703,
      start: 'grassland'
    },
    {
      area: 2830.4945615407,
      end: 'bare',
      perc_area: 0.6660460748278036,
      start: 'grassland'
    },
    {
      area: 5723.6313912819,
      end: 'wetlands',
      perc_area: 1.3468325548908469,
      start: 'wetlands'
    },
    {
      area: 2329.8856189617,
      end: 'bare',
      perc_area: 0.5482473601583261,
      start: 'forest'
    },
    {
      area: 486.6549281994,
      end: 'forest',
      perc_area: 0.11451518371629846,
      start: 'bare'
    },
    {
      area: 44.3811661784,
      end: 'forest',
      perc_area: 0.010443369837571314,
      start: 'grassland'
    },
    {
      area: 24.9396877441,
      end: 'bare',
      perc_area: 0.005868579065683548,
      start: 'cropland'
    },
    {
      area: 22.2146155579,
      end: 'cropland',
      perc_area: 0.005227340019368979,
      start: 'bare'
    },
    {
      area: 32.6848337036,
      end: 'settlements',
      perc_area: 0.007691095927360698,
      start: 'bare'
    },
    {
      area: 12.2222577248,
      end: 'forest',
      perc_area: 0.002876029826641229,
      start: 'wetlands'
    },
    {
      area: 23.2084466674,
      end: 'settlements',
      perc_area: 0.005461199260265711,
      start: 'grassland'
    },
    {
      area: 16.9701048401,
      end: 'settlements',
      perc_area: 0.0039932497563296915,
      start: 'cropland'
    },
    {
      area: 7.5481478882,
      end: 'wetlands',
      perc_area: 0.0017761610785144392,
      start: 'cropland'
    },
    {
      area: 6.9812792053,
      end: 'forest',
      perc_area: 0.001642770728178335,
      start: 'cropland'
    },
    {
      area: 10.176562341499999,
      end: 'wetlands',
      perc_area: 0.0023946555117587195,
      start: 'bare'
    },
    {
      area: 7.0213236127,
      end: 'wetlands',
      perc_area: 0.001652193611631274,
      start: 'forest'
    },
    {
      area: 6.6582304692,
      end: 'wetlands',
      perc_area: 0.00156675385622209,
      start: 'grassland'
    },
    {
      area: 5.6259919737,
      end: 'grassland',
      perc_area: 0.0013238569407658376,
      start: 'wetlands'
    },
    {
      area: 4.0054142761,
      end: 'grassland',
      perc_area: 0.0009425174288988975,
      start: 'cropland'
    },
    {
      area: 6.918871435599999,
      end: 'settlements',
      perc_area: 0.0016280855029840436,
      start: 'forest'
    },
    {
      area: 1.8573416247,
      end: 'cropland',
      perc_area: 0.0004370526322694517,
      start: 'forest'
    },
    {
      area: 3.6036583923000003,
      end: 'bare',
      perc_area: 0.0008479799112933839,
      start: 'wetlands'
    },
    {
      area: 0.7990448669,
      end: 'cropland',
      perc_area: 0.0001880239250204958,
      start: 'grassland'
    },
    {
      area: 2.5140436828,
      end: 'settlements',
      perc_area: 0.0005915817502801086,
      start: 'wetlands'
    },
    {
      area: 0.0573587769,
      end: 'cropland',
      perc_area: 1.3497142418240027e-5,
      start: 'wetlands'
    }
  ];
