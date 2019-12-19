import axios from 'axios';
import moment from 'moment';
import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';
import DATASETS from 'data/analysis-datasets.json';

const {
  ANNUAL_ADM0_SUMMARY,
  ANNUAL_ADM1_SUMMARY,
  ANNUAL_ADM2_SUMMARY,
  ANNUAL_ADM0_CHANGE,
  ANNUAL_ADM1_CHANGE,
  ANNUAL_ADM2_CHANGE,
  ANNUAL_ADM0_WHITELIST,
  ANNUAL_ADM1_WHITELIST,
  ANNUAL_ADM2_WHITELIST,
  GLAD_ADM0_WEEKLY,
  GLAD_ADM1_WEEKLY,
  GLAD_ADM2_WEEKLY,
  GLAD_ADM0_WHITELIST,
  GLAD_ADM1_WHITELIST,
  GLAD_ADM2_WHITELIST,
  ANNUAL_WDPA_SUMMARY,
  ANNUAL_WDPA_CHANGE,
  ANNUAL_WDPA_WHITELIST,
  GLAD_WDPA_WEEKLY,
  GLAD_WDPA_WHITELIST,
  ANNUAL_GEOSTORE_SUMMARY,
  ANNUAL_GEOSTORE_CHANGE,
  ANNUAL_GEOSTORE_WHITELIST,
  GLAD_GEOSTORE_WEEKLY,
  GLAD_GEOSTORE_WHITELIST
} = DATASETS[process.env.FEATURE_ENV];

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
  glad:
    'SELECT alert__year, alert__week, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} GROUP BY alert__year, alert__week ORDER BY alert__year DESC, alert__week DESC',
  gladLatest:
    'SELECT alert__year, alert__week FROM data GROUP BY alert__year, alert__week ORDER BY alert__year DESC, alert__week DESC LIMIT 1',
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
  if (summary && (adm2 || (adm1 && grouped))) return ANNUAL_ADM2_SUMMARY;
  if (summary && (adm1 || (adm0 && grouped)) && whitelist) {
    return ANNUAL_ADM1_WHITELIST;
  }
  if (summary && (adm1 || (adm0 && grouped))) return ANNUAL_ADM1_SUMMARY;
  if (summary && whitelist) return ANNUAL_ADM0_WHITELIST;
  if (summary) return ANNUAL_ADM0_SUMMARY;

  // else return change datasets
  if (adm2 || (adm1 && grouped)) return ANNUAL_ADM2_CHANGE;
  if (adm1 || (adm0 && grouped)) return ANNUAL_ADM1_CHANGE;
  return ANNUAL_ADM0_CHANGE;
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
      let paramKey = p;
      if (p === 'threshold') paramKey = 'treecover_density__threshold';
      if (p === 'iso' && params.type === 'geostore') paramKey = 'geostore__id';
      if (p === 'iso' && params.type === 'wdpa') paramKey = 'wdpa_id';

      const polynameString = `
        ${
  isPolyname && tableKey.includes('is__') ? `${tableKey} = 'true'` : ''
}${
  isPolyname && !tableKey.includes('is__') ? `${tableKey} is not '0'` : ''
}${
  isPolyname &&
        polynameMeta &&
        !tableKey.includes('is__') &&
        polynameMeta.default &&
        polynameMeta.categories
    ? ` AND ${tableKey} ${polynameMeta.comparison || '='} '${
      polynameMeta.default
    }'`
    : ''
}${
  !isPolyname
    ? `${paramKey} = ${typeof value === 'number' ? value : `'${value}'`}`
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
  const url = `${getRequestUrl({ adm0, adm1, adm2, ...params })}${
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
  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    grouped: true
  })}${SQL_QUERIES.lossGrouped}`
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
  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    summary: true
  })}${SQL_QUERIES.extent}`
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
    ...params,
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
    ...params,
    adm0,
    adm1,
    adm2,
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
    ...params,
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

  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    summary: true
  })}${SQL_QUERIES.areaIntersection}`
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
    ...params,
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

export const fetchGladAlerts = ({ adm0, adm1, adm2, tsc, ...params }) => {
  const { glad } = SQL_QUERIES;
  const url = `${getRequestUrl({ ...params, adm0, adm1, adm2, glad: true })}${
    glad
  }`.replace('{WHERE}', getWHEREQuery({ iso: adm0, adm1, adm2, ...params }));
  return axios.get(url).then(response => ({
    data: {
      data: response.data.data.map(d => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count
      }))
    }
  }));
};

// Latest Dates for Alerts
const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchGLADLatest = () => {
  const url = `${process.env.GFW_API}/glad-alerts/latest`;
  return axios
    .get(url)
    .then(response => {
      const { date } = response.data.data[0].attributes;

      return {
        attributes: { updatedAt: date },
        id: null,
        type: 'glad-alerts'
      };
    })
    .catch(error => {
      console.error('Error in gladRequest', error);
      return new Promise(resolve =>
        resolve({
          attributes: { updatedAt: lastFriday },
          id: null,
          type: 'glad-alerts'
        })
      );
    });
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
