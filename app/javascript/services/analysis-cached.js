import axios from 'axios';
import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';

// contains everything summed without years inc gain and extent
const ADM0_SUMMARY = process.env.ANNUAL_ADM0_SUMMARY;
const ADM1_SUMMARY = process.env.ANNUAL_ADM1_SUMMARY;
const ADM2_SUMMARY = process.env.ANNUAL_ADM2_SUMMARY;

// contains yearly data for loss
const ADM0_CHANGE = process.env.ANNUAL_ADM0_CHANGE;
const ADM1_CHANGE = process.env.ANNUAL_ADM1_CHANGE;
const ADM2_CHANGE = process.env.ANNUAL_ADM2_CHANGE;

const ANNUAL_ADM0_WHITELIST = process.env.ANNUAL_ADM0_WHITELIST;
const ANNUAL_ADM1_WHITELIST = process.env.ANNUAL_ADM1_WHITELIST;
const ANNUAL_ADM2_WHITELIST = process.env.ANNUAL_ADM2_WHITELIST;

// glad gadm36
const GLAD_ADM0_WEEKLY = process.env.GLAD_ADM0_WEEKLY;
const GLAD_ADM1_WEEKLY = process.env.GLAD_ADM1_WEEKLY;
const GLAD_ADM2_WEEKLY = process.env.GLAD_ADM2_WEEKLY;

const GLAD_ADM0_WHITELIST = process.env.GLAD_ADM0_WHITELIST;
const GLAD_ADM1_WHITELIST = process.env.GLAD_ADM1_WHITELIST;
const GLAD_ADM2_WHITELIST = process.env.GLAD_ADM2_WHITELIST;

// wdpa
const ANNUAL_WDPA_SUMMARY = process.env.ANNUAL_WDPA_SUMMARY;
const ANNUAL_WDPA_CHANGE = process.env.ANNUAL_WDPA_CHANGE;
const ANNUAL_WDPA_WHITELIST = process.env.ANNUAL_WDPA_WHITELIST;
const GLAD_WDPA_WEEKLY = process.env.GLAD_WDPA_WEEKLY;
const GLAD_WDPA_WHITELIST = process.env.GLAD_WDPA_WHITELIST;

// geostore tables
const ANNUAL_GEOSTORE_SUMMARY = process.env.ANNUAL_GEOSTORE_SUMMARY;
const ANNUAL_GEOSTORE_CHANGE = process.env.ANNUAL_GEOSTORE_CHANGE;
const ANNUAL_GEOSTORE_WHITELIST = process.env.ANNUAL_GEOSTORE_WHITELIST;
const GLAD_GEOSTORE_WEEKLY = process.env.GLAD_GEOSTORE_WEEKLY;
const GLAD_GEOSTORE_WHITELIST = process.env.GLAD_GEOSTORE_WHITELIST;

const CARTO_REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const SQL_QUERIES = {
  loss:
    'SELECT treecover_loss__year, SUM(aboveground_biomass_loss__Mg) as aboveground_biomass_loss__Mg, SUM(aboveground_co2_emissions__Mg) AS aboveground_co2_emissions__Mg, SUM(treecover_loss__ha) AS treecover_loss__ha FROM data {WHERE} GROUP BY treecover_loss__year ORDER BY treecover_loss__year',
  lossTsc:
    'SELECT tcs_driver__type, treecover_loss__year, SUM(treecover_loss__ha) AS treecover_loss__ha, SUM(aboveground_biomass_loss__Mg) as aboveground_biomass_loss__Mg, SUM(aboveground_co2_emissions__Mg) AS aboveground_co2_emissions__Mg FROM data {WHERE} GROUP BY tcs_driver__type, treecover_loss__year',
  lossGrouped:
    'SELECT treecover_loss__year, SUM(aboveground_biomass_loss__Mg) as aboveground_biomass_loss__Mg, SUM(aboveground_co2_emissions__Mg) AS aboveground_co2_emissions__Mg, SUM(treecover_loss__ha) AS treecover_loss__ha FROM data {WHERE} GROUP BY treecover_loss__year, {location} ORDER BY treecover_loss__year, {location}',
  extent:
    'SELECT SUM(treecover_extent_{extentYear}__ha) as treecover_extent_{extentYear}__ha, SUM(area__ha) as area__ha FROM data {WHERE}',
  extentGrouped:
    'SELECT {location}, SUM(treecover_extent_{extentYear}__ha) as treecover_extent_{extentYear}__ha, SUM(area__ha) as area__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  gain:
    'SELECT SUM(treecover_gain_2000-2012__ha) as treecover_gain_2000-2012__ha FROM data {WHERE}',
  gainGrouped:
    'SELECT {location}, SUM(treecover_gain_2000-2012__ha) as treecover_gain_2000-2012__ha, SUM(treecover_extent_2000__ha) as treecover_extent_2000__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  areaIntersection:
    'SELECT {location}, {intersection}, SUM(area__ha) as area__ha FROM data {WHERE} GROUP BY {location}, {intersection} ORDER BY area__ha DESC',
  nonGlobalDatasets:
    'SELECT {polynames} FROM polyname_whitelist WHERE iso is null AND adm1 is null AND adm2 is null',
  getLocationPolynameWhitelist:
    'SELECT {location}, {polynames} FROM data {WHERE}'
};

const ALLOWED_PARAMS = [
  'iso',
  'adm1',
  'adm2',
  'threshold',
  'forestType',
  'landCategory'
];

const getAnnualDataset = ({
  adm0,
  adm1,
  adm2,
  grouped,
  summary,
  type,
  whitelist
}) => {
  if (whitelist && adm0 && adm1 && adm2) return ANNUAL_ADM2_WHITELIST;
  if (whitelist && adm0 && adm1) return ANNUAL_ADM1_WHITELIST;
  if (whitelist) return ANNUAL_ADM0_WHITELIST;

  if (type === 'geostore' && summary && whitelist) {
    return ANNUAL_GEOSTORE_WHITELIST;
  }
  if (type === 'geostore' && summary) return ANNUAL_GEOSTORE_SUMMARY;
  if (type === 'geostore') return ANNUAL_GEOSTORE_CHANGE;

  if (type === 'wdpa' && summary && whitelist) return ANNUAL_WDPA_WHITELIST;
  if (type === 'wdpa' && summary) return ANNUAL_WDPA_SUMMARY;
  if (type === 'wdpa') return ANNUAL_WDPA_CHANGE;

  if (summary && (adm2 || (adm1 && grouped)) && whitelist) {
    return ANNUAL_ADM2_WHITELIST;
  }
  if (summary && (adm2 || (adm1 && grouped))) return ADM2_SUMMARY;
  if (summary && (adm1 || (adm0 && grouped)) && whitelist) {
    return ANNUAL_ADM1_WHITELIST;
  }
  if (summary && (adm1 || (adm0 && grouped))) return ADM1_SUMMARY;
  if (summary && whitelist) return ANNUAL_ADM0_WHITELIST;
  if (summary) return ADM0_SUMMARY;

  // else return change datasets
  if (adm2 || (adm1 && grouped)) return ADM2_CHANGE;
  if (adm1 || (adm0 && grouped)) return ADM1_CHANGE;
  return ADM0_CHANGE;
};

const getGladDatasetId = ({ adm0, adm1, adm2, grouped, type, whitelist }) => {
  if (type === 'geostore' && whitelist) return GLAD_GEOSTORE_WHITELIST;
  if (type === 'geostore') return GLAD_GEOSTORE_WEEKLY;

  if (type === 'wdpa' && whitelist) return GLAD_WDPA_WHITELIST;
  if (type === 'wdpa') return GLAD_WDPA_WEEKLY;

  if (adm2 || (adm1 && grouped && whitelist)) return GLAD_ADM2_WHITELIST;
  if (adm2 || (adm1 && grouped)) return GLAD_ADM2_WEEKLY;
  if (adm1 || (adm0 && grouped && whitelist)) return GLAD_ADM1_WHITELIST;
  if (adm1 || (adm0 && grouped)) return GLAD_ADM1_WEEKLY;
  if (whitelist) return GLAD_ADM0_WHITELIST;

  return GLAD_ADM0_WEEKLY;
};

const getLocationSelect = ({ adm1, adm2 }) =>
  `iso${adm1 ? ', adm1' : ''}${adm2 ? ', adm2' : ''}`;

const getLocationSelectGrouped = ({ adm0, adm1 }) =>
  `iso${adm0 ? ', adm1' : ''}${adm1 ? ', adm2' : ''}`;

const buildPolynameSelects = nonTable => {
  const allPolynames = forestTypes
    .concat(landCategories)
    .filter(p => !p.hidden);
  let polyString = '';
  allPolynames.forEach((p, i) => {
    const isLast = i === allPolynames.length - 1;
    polyString = polyString.concat(
      `${!nonTable ? p.tableKey : p.value} as ${p.value}${isLast ? '' : ', '}`
    );
  });

  return polyString;
};

const getRequestUrl = ({ glad, ...params }) => {
  const dataset = glad ? getGladDatasetId(params) : getAnnualDataset(params);
  const REQUEST_URL = `${process.env.GFW_API}/query/{dataset}?sql=`;
  return REQUEST_URL.replace('{dataset}', dataset);
};

export const getWHEREQuery = params => {
  const allPolynames = forestTypes.concat(landCategories);
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
      const tableKey =
        polynameMeta &&
        (params.glad ? polynameMeta.gladTableKey : polynameMeta.tableKey);

      const polynameString = `
        ${
  isPolyname && tableKey.includes('is__') ? `${tableKey} = 'true'` : ''
}${
  isPolyname && !tableKey.includes('is__') ? `${tableKey} is not '0'` : ''
}${
  isPolyname &&
        polynameMeta &&
        polynameMeta.default &&
        polynameMeta.categories
    ? ` AND ${tableKey} ${polynameMeta.comparison || '='} '${
      polynameMeta.default
    }'`
    : ''
}${
  !isPolyname
    ? `${p === 'threshold' ? 'treecover_density__threshold' : p} = ${
      typeof value === 'number' ? value : `'${value}'`
    }`
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
  const { loss, lossTsc } = SQL_QUERIES;
  const url = `${getRequestUrl({ adm0, adm1, adm2 })}${
    tsc ? lossTsc : loss
  }`.replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));
  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        bound1: d.tcs_driver__type,
        year: d.treecover_loss__year,
        area: d.treecover_loss__ha,
        emissions: d.aboveground_biomass_loss__Mg
      }))
    }
  }));
};

// disaggregated loss for child of location
export const getLossGrouped = ({ adm0, adm1, adm2, ...params }) => {
  const url = `${getRequestUrl({ adm0, adm1, adm2, grouped: true })}${
    SQL_QUERIES.lossGrouped
  }`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        year: d.treecover_loss__year,
        area: d.treecover_loss__ha,
        emissions: d.aboveground_biomass_loss__Mg
      }))
    }
  }));
};

// summed extent for single location
export const getExtent = ({ adm0, adm1, adm2, extentYear, ...params }) => {
  const url = `${getRequestUrl({ adm0, adm1, adm2, summary: true })}${
    SQL_QUERIES.extent
  }`
    .replace(/{extentYear}/g, extentYear)
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        extent: d[`treecover_extent_${extentYear}__ha`],
        total_area: d.area__ha
      }))
    }
  }));
};

// disaggregated extent for child of location
export const getExtentGrouped = ({
  adm0,
  adm1,
  adm2,
  extentYear,
  ...params
}) => {
  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    grouped: true,
    summary: true
  })}${SQL_QUERIES.extentGrouped}`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace(/{extentYear}/g, extentYear)
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));

  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        extent: d[`treecover_extent_${extentYear}__ha`],
        total_area: d.area__ha
      }))
    }
  }));
};

// summed gain for single location
export const getGain = ({ adm0, adm1, adm2, ...params }) => {
  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    grouped: false,
    summary: true
  })}${SQL_QUERIES.gain}`.replace(
    '{WHERE}',
    getWHEREQuery({ iso: adm0, adm1, adm2, ...params })
  );
  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        extent: d.treecover_extent_2000__ha,
        gain: d['treecover_gain_2000-2012__ha']
      }))
    }
  }));
};

// disaggregated gain for child of location
export const getGainGrouped = ({ adm0, adm1, adm2, ...params }) => {
  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    grouped: true,
    summary: true
  })}${SQL_QUERIES.gainGrouped}`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));
  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        extent: d.treecover_extent_2000__ha,
        gain: d['treecover_gain_2000-2012__ha']
      }))
    }
  }));
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
  const intersectionPolyname = forestTypes
    .concat(landCategories)
    .find(o => [forestType, landCategory].includes(o.value));

  const url = `${getRequestUrl({ adm0, adm1, adm2, summary: true })}${
    SQL_QUERIES.areaIntersection
  }`
    .replace(/{location}/g, getLocationSelect({ adm0, adm1, adm2 }))
    .replace(/{intersection}/g, intersectionPolyname.tableKey)
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

  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        intersection_area: d.area__ha,
        [forestType || landCategory]: d[intersectionPolyname.tableKey]
      }))
    }
  }));
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
  const intersectionPolyname = forestTypes
    .concat(landCategories)
    .find(o => [forestType, landCategory].includes(o.value));

  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    grouped: true,
    summary: true
  })}${SQL_QUERIES.areaIntersection}`
    .replace(/{location}/g, getLocationSelectGrouped({ adm0, adm1, adm2 }))
    .replace(/{intersection}/g, intersectionPolyname.tableKey)
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

  return axios.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        intersection_area: d.area__ha,
        [forestType || landCategory]: d[intersectionPolyname.tableKey]
      }))
    }
  }));
};

export const getNonGlobalDatasets = () => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.nonGlobalDatasets}`.replace(
    '{polynames}',
    buildPolynameSelects(true)
  );
  return axios.get(url);
};

export const getLocationPolynameWhitelist = params => {
  const url = `${getRequestUrl({ ...params, whitelist: true })}${
    SQL_QUERIES.getLocationPolynameWhitelist
  }`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{polynames}', buildPolynameSelects())
    .replace('{WHERE}', getWHEREQuery({ iso: params.adm0, ...params }));
  return axios.get(url);
};
