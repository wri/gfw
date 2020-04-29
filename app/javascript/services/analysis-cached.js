import axios from 'axios';
import { apiRequest, cartoRequest } from 'utils/request';
import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';
import DATASETS from 'data/analysis-datasets.json';
import snakeCase from 'lodash/snakeCase';
import moment from 'moment';

import { getIndicator } from 'utils/format';

const DATASETS_ENV = DATASETS[process.env.FEATURE_ENV || 'production'];

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

  ANNUAL_WDPA_SUMMARY,
  ANNUAL_WDPA_CHANGE,
  ANNUAL_WDPA_WHITELIST,

  ANNUAL_GEOSTORE_SUMMARY,
  ANNUAL_GEOSTORE_CHANGE,
  ANNUAL_GEOSTORE_WHITELIST
} = DATASETS[process.env.FEATURE_ENV || 'production'];

const SQL_QUERIES = {
  loss:
    'SELECT treecover_loss__year, SUM(aboveground_biomass_loss__Mg) as aboveground_biomass_loss__Mg, SUM(aboveground_co2_emissions__Mg) AS aboveground_co2_emissions__Mg, SUM(treecover_loss__ha) AS treecover_loss__ha FROM data {WHERE} AND treecover_loss__year > 0 GROUP BY treecover_loss__year ORDER BY treecover_loss__year',
  lossTsc:
    'SELECT tcs_driver__type, treecover_loss__year, SUM(treecover_loss__ha) AS treecover_loss__ha, SUM(aboveground_biomass_loss__Mg) as aboveground_biomass_loss__Mg, SUM(aboveground_co2_emissions__Mg) AS aboveground_co2_emissions__Mg FROM data {WHERE} AND treecover_loss__year > 0 GROUP BY tcs_driver__type, treecover_loss__year',
  lossGrouped:
    'SELECT treecover_loss__year, SUM(aboveground_biomass_loss__Mg) as aboveground_biomass_loss__Mg, SUM(aboveground_co2_emissions__Mg) AS aboveground_co2_emissions__Mg, SUM(treecover_loss__ha) AS treecover_loss__ha FROM data {WHERE} AND treecover_loss__year > 0 GROUP BY treecover_loss__year, {location} ORDER BY treecover_loss__year, {location}',
  extent:
    'SELECT SUM(treecover_extent_{extentYear}__ha) as treecover_extent_{extentYear}__ha, SUM(area__ha) as area__ha FROM data {WHERE}',
  extentGrouped:
    'SELECT {location}, SUM(treecover_extent_{extentYear}__ha) as treecover_extent_{extentYear}__ha, SUM(area__ha) as area__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  gain:
    'SELECT SUM(treecover_gain_2000-2012__ha) as treecover_gain_2000-2012__ha, SUM(treecover_extent_2000__ha) as treecover_extent_2000__ha FROM data {WHERE}',
  gainGrouped:
    'SELECT {location}, SUM(treecover_gain_2000-2012__ha) as treecover_gain_2000-2012__ha, SUM(treecover_extent_2000__ha) as treecover_extent_2000__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  areaIntersection:
    'SELECT {location}, {intersection}, SUM(area__ha) as area__ha FROM data {WHERE} GROUP BY {location}, {intersection} ORDER BY area__ha DESC',
  glad:
    'SELECT {location}, alert__year, alert__week, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} GROUP BY {location}, alert__year, alert__week',
  fires:
    'SELECT {location}, alert__year, alert__week, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha, confidence__cat FROM data {WHERE} GROUP BY {location}, alert__year, alert__week',
  nonGlobalDatasets:
    'SELECT {polynames} FROM polyname_whitelist WHERE iso is null AND adm1 is null AND adm2 is null',
  getLocationPolynameWhitelist:
    'SELECT {location}, {polynames} FROM data {WHERE}'
};

const ALLOWED_PARAMS = {
  default: ['adm0', 'adm1', 'adm2', 'threshold', 'forestType', 'landCategory'],
  glad: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory'],
  fires: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence']
};

const getAnnualDataset = ({
  adm0,
  adm1,
  adm2,
  grouped,
  summary,
  type,
  whitelist
}) => {
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
  if (type === 'geostore' && whitelist) {
    return DATASETS_ENV.GLAD_GEOSTORE_WHITELIST;
  }
  if (type === 'geostore') return DATASETS_ENV.GLAD_GEOSTORE_WEEKLY;

  if (type === 'wdpa' && whitelist) return DATASETS_ENV.GLAD_WDPA_WHITELIST;
  if (type === 'wdpa') return DATASETS_ENV.GLAD_WDPA_WEEKLY;

  if ((adm2 || (adm1 && grouped)) && whitelist) {
    return DATASETS_ENV.GLAD_ADM2_WHITELIST;
  }
  if (adm2 || (adm1 && grouped)) return DATASETS_ENV.GLAD_ADM2_WEEKLY;
  if ((adm1 || (adm0 && grouped)) && whitelist) {
    return DATASETS_ENV.GLAD_ADM1_WHITELIST;
  }
  if (adm1 || (adm0 && grouped)) return DATASETS_ENV.GLAD_ADM1_WEEKLY;
  if (whitelist) return DATASETS_ENV.GLAD_ADM0_WHITELIST;

  return DATASETS_ENV.GLAD_ADM0_WEEKLY;
};

const getFiresDatasetId = ({
  adm0,
  adm1,
  adm2,
  grouped,
  type,
  whitelist,
  dataset
}) => {
  if (type === 'geostore' && whitelist) {
    return DATASETS_ENV[`${dataset}_GEOSTORE_WHITELIST`];
  }
  if (type === 'geostore') return DATASETS_ENV[`${dataset}_GEOSTORE_WEEKLY`];

  if (type === 'wdpa' && whitelist) {
    return DATASETS_ENV[`${dataset}_WDPA_WHITELIST`];
  }
  if (type === 'wdpa') return DATASETS_ENV[`${dataset}_WDPA_WEEKLY`];

  if ((adm2 || (adm1 && grouped)) && whitelist) {
    return DATASETS_ENV[`${dataset}_ADM2_WHITELIST`];
  }
  if (adm2 || (adm1 && grouped)) return DATASETS_ENV[`${dataset}_ADM2_WEEKLY`];
  if ((adm1 || (adm0 && grouped)) && whitelist) {
    return DATASETS_ENV[`${dataset}_ADM1_WHITELIST`];
  }
  if (adm1 || (adm0 && grouped)) return DATASETS_ENV[`${dataset}_ADM1_WEEKLY`];
  if (whitelist) return DATASETS_ENV[`${dataset}_ADM0_WHITELIST`];

  return DATASETS_ENV[`${dataset}_ADM0_WEEKLY`];
};

const getLocationSelect = ({ type, adm1, adm2 }) => {
  if (type === 'wdpa') return 'wdpa_protected_area__id';
  if (['geostore', 'use'].includes(type)) return 'geostore__id';
  return `iso${adm1 ? ', adm1' : ''}${adm2 ? ', adm2' : ''}`;
};

const getLocationSelectGrouped = ({ type, adm0, adm1 }) => {
  if (type === 'wdpa') return 'wdpa_protected_area__id';
  if (['geostore', 'use'].includes(type)) return 'geostore__id';
  return `iso${adm0 ? ', adm1' : ''}${adm1 ? ', adm2' : ''}`;
};

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

const getRequestUrl = params => {
  const getDataset = type => {
    switch (type) {
      case 'glad': {
        return getGladDatasetId(params);
      }

      case 'fires': {
        return getFiresDatasetId(params);
      }

      default: {
        return getAnnualDataset(params);
      }
    }
  };
  const dataset = getDataset(params.allowedParams);
  const REQUEST_URL = `${process.env.GFW_API}/query/{dataset}?sql=`;
  return REQUEST_URL.replace('{dataset}', dataset);
};

export const getWHEREQuery = params => {
  const allPolynames = forestTypes.concat(landCategories);
  const paramKeys = params && Object.keys(params);
  const allowedParams = ALLOWED_PARAMS[params.allowedParams || 'default'];

  const paramKeysFiltered = paramKeys.filter(
    p => (params[p] || p === 'threshold') && allowedParams.includes(p)
  );
  const { type, glad } = params || {};
  if (paramKeysFiltered && paramKeysFiltered.length) {
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
        (glad && polynameMeta.gladTableKey
          ? polynameMeta.gladTableKey
          : polynameMeta.tableKey);
      let paramKey = p;
      if (p === 'confidence') paramKey = 'confidence__cat';
      if (p === 'threshold') paramKey = 'treecover_density__threshold';
      if (p === 'adm0' && type === 'country') paramKey = 'iso';
      if (p === 'adm0' && type === 'geostore') paramKey = 'geostore__id';
      if (p === 'adm0' && type === 'wdpa') paramKey = 'wdpa_protected_area__id';

      const polynameString = `
        ${
  isPolyname && tableKey.includes('is__') ? `${tableKey} = 'true'` : ''
}${
  isPolyname && !tableKey.includes('is__') ? `${tableKey} is not 0` : ''
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
    ? `${paramKey} = ${
      typeof value === 'number' || (p !== 'adm0' && p !== 'confidence')
        ? value
        : `'${value}'`
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
export const getLoss = ({
  adm0,
  adm1,
  adm2,
  tsc,
  download,
  forestType,
  landCategory,
  ifl,
  ...params
}) => {
  const { loss, lossTsc } = SQL_QUERIES;
  const url = `${getRequestUrl({ adm0, adm1, adm2, ...params })}${
    tsc ? lossTsc : loss
  }`.replace(
    '{WHERE}',
    getWHEREQuery({
      adm0,
      adm1,
      adm2,
      forestType,
      landCategory,
      ifl,
      ...params
    })
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        bound1: d.tcs_driver__type,
        year: d.treecover_loss__year,
        area: d.treecover_loss__ha,
        emissions: d.aboveground_co2_emissions__Mg,
        biomassLoss: d.aboveground_biomass_loss__Mg
      }))
    }
  }));
};

// disaggregated loss for child of location
export const getLossGrouped = ({
  adm0,
  adm1,
  adm2,
  download,
  forestType,
  landCategory,
  ifl,
  ...params
}) => {
  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    grouped: true,
    ...params
  })}${SQL_QUERIES.lossGrouped}`
    .replace(
      /{location}/g,
      getLocationSelectGrouped({ adm0, adm1, adm2, ...params })
    )
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
    ...response,
    data: {
      data: response.data.data.map(d => ({
        ...d,
        year: d.treecover_loss__year,
        area: d.treecover_loss__ha,
        emissions: d.aboveground_co2_emissions__Mg,
        biomassLoss: d.aboveground_biomass_loss__Mg
      }))
    }
  }));
};

// summed extent for single location
export const getExtent = ({
  adm0,
  adm1,
  adm2,
  extentYear,
  download,
  forestType,
  landCategory,
  ifl,
  ...params
}) => {
  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    summary: true,
    ...params
  })}${SQL_QUERIES.extent}`
    .replace(/{extentYear}/g, extentYear)
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_${extentYear}${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
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
  download,
  forestType,
  landCategory,
  ifl,
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
    .replace(
      /{location}/g,
      getLocationSelectGrouped({ adm0, adm1, adm2, ...params })
    )
    .replace(/{extentYear}/g, extentYear)
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_${extentYear}_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
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
export const getGain = ({
  adm0,
  adm1,
  adm2,
  download,
  forestType,
  landCategory,
  ifl,
  ...params
}) => {
  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    summary: true
  })}${SQL_QUERIES.gain}`.replace(
    '{WHERE}',
    getWHEREQuery({
      adm0,
      adm1,
      adm2,
      forestType,
      landCategory,
      ifl,
      ...params
    })
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_gain_2000-2012${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
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
export const getGainGrouped = ({
  adm0,
  adm1,
  adm2,
  download,
  forestType,
  landCategory,
  ifl,
  ...params
}) => {
  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    grouped: true,
    summary: true
  })}${SQL_QUERIES.gainGrouped}`
    .replace(
      /{location}/g,
      getLocationSelectGrouped({ adm0, adm1, adm2, ...params })
    )
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_gain_2000-2012_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
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
  download,
  ifl,
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
    .replace(/{location}/g, getLocationSelect({ adm0, adm1, adm2, ...params }))
    .replace(/{intersection}/g, intersectionPolyname.tableKey)
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_in_${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
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
  ifl,
  download,
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
    grouped: true
  })}${SQL_QUERIES.areaIntersection}`
    .replace(
      /{location}/g,
      getLocationSelectGrouped({ adm0, adm1, adm2, ...params })
    )
    .replace(/{intersection}/g, intersectionPolyname.tableKey)
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_in_${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }_by_region__ha`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
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

export const fetchGladAlerts = ({
  adm0,
  adm1,
  adm2,
  tsc,
  forestType,
  landCategory,
  ifl,
  grouped,
  download,
  ...params
}) => {
  const { glad } = SQL_QUERIES;
  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    grouped,
    allowedParams: 'glad'
  })}${glad}`
    .replace(
      /{location}/g,
      grouped
        ? getLocationSelectGrouped({ adm0, adm1, adm2, ...params })
        : getLocationSelect({ adm1, adm2, ...params })
    )
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        ifl,
        ...params,
        allowedParams: 'glad'
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `glad_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
    data: {
      data: response.data.data.map(d => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha
      }))
    }
  }));
};

// Latest Dates for Alerts
const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchGLADLatest = () => {
  const url = '/glad-alerts/latest';
  return apiRequest
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

export const fetchVIIRSAlerts = ({
  adm0,
  adm1,
  adm2,
  tsc,
  forestType,
  landCategory,
  confidence,
  ifl,
  grouped,
  download,
  ...params
}) => {
  const { fires } = SQL_QUERIES;
  const url = `${getRequestUrl({
    ...params,
    adm0,
    adm1,
    adm2,
    grouped,
    confidence,
    allowedParams: 'fires'
  })}${fires}`
    .replace(
      /{location}/g,
      grouped
        ? getLocationSelectGrouped({ adm0, adm1, adm2, ...params })
        : getLocationSelect({ adm1, adm2, ...params })
    )
    .replace(
      '{WHERE}',
      getWHEREQuery({
        adm0,
        adm1,
        adm2,
        forestType,
        landCategory,
        confidence,
        ifl,
        ...params,
        allowedParams: 'fires',
        glad: true
      })
    );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `viirs_fire_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
    data: {
      data: response.data.data.map(d => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha
      }))
    }
  }));
};

export const fetchVIIRSLatest = () => {
  const url =
    'https://d20lgxzbmjgu8w.cloudfront.net/nasa_viirs_fire_alerts/v202003/max_alert__date';

  return axios
    .get(url)
    .then(({ data }) => {
      const date = data.max_date;

      return {
        attributes: { updatedAt: date },
        id: null,
        type: 'viirs-alerts'
      };
    })
    .catch(error => {
      console.error('Error in VIIRS request', error);
      return new Promise(resolve =>
        resolve({
          attributes: { updatedAt: moment().format('YYYY-MM-DD') },
          id: null,
          type: 'viirs-alerts'
        })
      );
    });
};

export const getNonGlobalDatasets = () => {
  const url = `/sql?q=${SQL_QUERIES.nonGlobalDatasets}`.replace(
    '{polynames}',
    buildPolynameSelects(true)
  );
  return cartoRequest.get(url);
};

export const getLocationPolynameWhitelist = params => {
  const url = `${getRequestUrl({ ...params, whitelist: true, summary: true })}${
    SQL_QUERIES.getLocationPolynameWhitelist
  }`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{polynames}', buildPolynameSelects())
    .replace('{WHERE}', getWHEREQuery(params));
  return apiRequest.get(url);
};
