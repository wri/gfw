import axios from 'axios';
import { apiRequest, cartoRequest } from 'utils/request';
import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';
import DATASETS from 'data/analysis-datasets.json';
import snakeCase from 'lodash/snakeCase';
import moment from 'moment';

import { getIndicator } from 'utils/format';

const DATASETS_ENV = DATASETS[process.env.FEATURE_ENV || 'production'];

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
  firesWithin:
    'SELECT {location}, alert__week, alert__year, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND alert__year >= {alert__year} AND alert__week >= 1 GROUP BY alert__year, alert__week ORDER BY alert__week DESC, alert__year DESC',
  nonGlobalDatasets:
    'SELECT {polynames} FROM polyname_whitelist WHERE iso is null AND adm1 is null AND adm2 is null',
  getLocationPolynameWhitelist:
    'SELECT {location}, {polynames} FROM data {WHERE}',
  modisFiresWeekly:
    'SELECT alert__week, alert__year, SUM(alert__count) AS alert__count FROM data {WHERE} GROUP BY alert__week, alert__year ORDER BY alert__year DESC, alert__week DESC',
  modisFiresDaily:
    'SELECT alert__date, SUM(alert__count) AS alert__count FROM data {WHERE} GROUP BY alert__date ORDER BY alert__date DESC'
};

const ALLOWED_PARAMS = {
  annual: ['adm0', 'adm1', 'adm2', 'threshold', 'forestType', 'landCategory'],
  glad: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory'],
  viirs: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence'],
  modis: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence']
};

//
// function for building analysis table queries from params
//

const typeByGrouped = {
  global: {
    default: 'adm0',
    grouped: 'adm0'
  },
  adm0: {
    default: 'adm0',
    grouped: 'adm1'
  },
  adm1: {
    default: 'adm1',
    grouped: 'adm2'
  },
  adm2: {
    default: 'adm2',
    grouped: 'adm2'
  }
};

// build the base query for the query with the correct dataset id
const getRequestUrl = ({ type, adm1, adm2, dataset, datasetType, grouped }) => {
  let typeByLevel = type;
  if (type === 'country' || type === 'global') {
    if (!adm1) typeByLevel = 'adm0';
    if (adm1) typeByLevel = 'adm1';
    if (adm2) typeByLevel = 'adm2';
    typeByLevel = typeByGrouped[typeByLevel][grouped ? 'grouped' : 'default'];
  }

  const datasetId =
    DATASETS_ENV[
      `${dataset.toUpperCase()}_${typeByLevel.toUpperCase()}_${datasetType.toUpperCase()}`
    ];
  return `${process.env.GFW_API}/query/${datasetId}?sql=`;
};

// build {select} from location params
const getLocationSelect = ({ type, adm0, adm1, adm2, grouped }) => {
  if (type === 'wdpa') return 'wdpa_protected_area__id';
  if (['geostore', 'use'].includes(type)) return 'geostore__id';
  if (grouped) return `iso${adm0 ? ', adm1' : ''}${adm1 ? ', adm2' : ''}`;
  return `iso${adm1 ? ', adm1' : ''}${adm2 ? ', adm2' : ''}`;
};

// build {where} statement for query
export const getWHEREQuery = params => {
  const allPolynames = forestTypes.concat(landCategories);
  const paramKeys = params && Object.keys(params);
  const allowedParams = ALLOWED_PARAMS[params.dataset || 'annual'];
  const paramKeysFiltered = paramKeys.filter(
    p => (params[p] || p === 'threshold') && allowedParams.includes(p)
  );
  const { type, dataset } = params || {};
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
        (polynameMeta.tableKey || polynameMeta.tableKeys[dataset || 'annual']);
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

//
// data fetches
//

// summed loss for single location
export const getLoss = params => {
  const { forestType, landCategory, ifl, download } = params || {};
  const { loss, lossTsc } = SQL_QUERIES;
  const query = params.lossTsc ? lossTsc : loss;
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change'
  })}${query}`.replace(
    '{WHERE}',
    getWHEREQuery({ ...params, dataset: 'annual' })
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
export const getLossGrouped = params => {
  const { forestType, landCategory, ifl, download } = params || {};
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
    grouped: true
  })}${SQL_QUERIES.lossGrouped}`
    .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }));

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
export const getExtent = params => {
  const { forestType, landCategory, ifl, download, extentYear } = params || {};
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary'
  })}${SQL_QUERIES.extent}`
    .replace(/{extentYear}/g, extentYear)
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }));

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
export const getExtentGrouped = params => {
  const { forestType, landCategory, ifl, download, extentYear } = params || {};
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true
  })}${SQL_QUERIES.extentGrouped}`
    .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
    .replace(/{extentYear}/g, extentYear)
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }));

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
export const getGain = params => {
  const { forestType, landCategory, ifl, download } = params || {};
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary'
  })}${SQL_QUERIES.gain}`.replace(
    '{WHERE}',
    getWHEREQuery({ ...params, dataset: 'annual' })
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
export const getGainGrouped = params => {
  const { forestType, landCategory, ifl, download } = params || {};
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true
  })}${SQL_QUERIES.gainGrouped}`
    .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }));

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
export const getAreaIntersection = params => {
  const { forestType, landCategory, ifl, download } = params || {};
  const intersectionPolyname = forestTypes
    .concat(landCategories)
    .find(o => [forestType, landCategory].includes(o.value));
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary'
  })}${SQL_QUERIES.areaIntersection}`
    .replace(/{location}/g, getLocationSelect(params))
    .replace(
      /{intersection}/g,
      intersectionPolyname.tableKey || intersectionPolyname.tableKeys.annual
    )
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }));

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
        [forestType || landCategory]:
          d[intersectionPolyname.tableKey] ||
          d[intersectionPolyname.tableKeys.annual]
      }))
    }
  }));
};

// total area for a given of polyname in location
export const getAreaIntersectionGrouped = params => {
  const { forestType, landCategory, ifl, download } = params || {};
  const intersectionPolyname = forestTypes
    .concat(landCategories)
    .find(o => [forestType, landCategory].includes(o.value));
  const url = `${getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true
  })}${SQL_QUERIES.areaIntersection}`
    .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
    .replace(
      /{intersection}/g,
      intersectionPolyname.tableKey || intersectionPolyname.tableKeys.annual
    )
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }));

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
        [forestType || landCategory]:
          d[intersectionPolyname.tableKey] ||
          d[intersectionPolyname.tableKeys.annual]
      }))
    }
  }));
};

export const fetchGladAlerts = params => {
  const { forestType, landCategory, ifl, download } = params || {};

  const url = `${getRequestUrl({
    ...params,
    dataset: 'glad',
    datasetType: 'weekly'
  })}${SQL_QUERIES.glad}`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }));

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
    .catch(
      () =>
        new Promise(resolve =>
          resolve({
            attributes: { updatedAt: lastFriday },
            id: null,
            type: 'glad-alerts'
          })
        )
    );
};

export const fetchVIIRSAlerts = params => {
  const { forestType, landCategory, ifl, download, dataset } = params || {};
  const url = `${getRequestUrl({ ...params, dataset, datasetType: 'weekly' })}${
    SQL_QUERIES.fires
  }`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset }));

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

export const fetchFiresWithin = params => {
  const { forestType, landCategory, ifl, download, dataset, weeks } =
    params || {};
  const filterYear = moment()
    .subtract(weeks, 'weeks')
    .year();
  const url = `${getRequestUrl({ ...params, dataset, datasetType: 'weekly' })}${
    SQL_QUERIES.firesWithin
  }`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset }))
    .replace('{alert__year}', filterYear);

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
        count: d.alert__count,
        alerts: d.alert__count
      }))
    }
  }));
};

export const fetchMODISHistorical = (params) => {
  const { forestType, landCategory, ifl, download, frequency } = params || {};
  const { modisFiresDaily, modisFiresWeekly } = SQL_QUERIES;

  const url = `${getRequestUrl({ ...params, dataset: 'modis', datasetType: 'weekly' })}${frequency === 'daily' ? modisFiresDaily : modisFiresWeekly}`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'modis' }));

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
        week: parseInt(d.alert__week, 10) || null,
        year: parseInt(d.alert__year, 10) || null,
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
    .catch(
      () =>
        new Promise(resolve =>
          resolve({
            attributes: { updatedAt: moment().format('YYYY-MM-DD') },
            id: null,
            type: 'viirs-alerts'
          })
        )
    );
};

// Additional conditional fetches for providing context for queries.

// generate {select} query using all available forest types and land categories
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

// get counts of countries that each forest type and land category intersects with
export const getNonGlobalDatasets = () => {
  const url = `/sql?q=${SQL_QUERIES.nonGlobalDatasets}`.replace(
    '{polynames}',
    buildPolynameSelects(true)
  );
  return cartoRequest.get(url);
};

// get a boolean list of forest types and land categories inside a given shape
export const getLocationPolynameWhitelist = params => {
  const url = `${getRequestUrl({ ...params, datasetType: 'whitelist' })}${
    SQL_QUERIES.getLocationPolynameWhitelist
  }`
    .replace(/{location}/g, getLocationSelect(params))
    .replace('{polynames}', buildPolynameSelects())
    .replace('{WHERE}', getWHEREQuery(params));
  return apiRequest.get(url);
};
