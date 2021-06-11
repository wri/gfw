import { apiRequest, tilesRequest, cartoRequest } from 'utils/request';
import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';
import DATASETS from 'data/analysis-datasets.json';
import snakeCase from 'lodash/snakeCase';
import moment from 'moment';

import { GFW_DATA_API_PROXY } from 'utils/apis';

const VIIRS_START_YEAR = 2012;

const SQL_QUERIES = {
  lossTsc:
    'SELECT tsc_tree_cover_loss_drivers__type, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg" FROM data {WHERE} GROUP BY tsc_tree_cover_loss_drivers__type, umd_tree_cover_loss__year',
  loss:
    'SELECT {select_location}, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg" FROM data {WHERE} GROUP BY umd_tree_cover_loss__year, {location} ORDER BY umd_tree_cover_loss__year, {location}',
  emissions:
    'SELECT {select_location}, umd_tree_cover_loss__year, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", SUM("gfw_gross_emissions_co2e_non_co2__Mg") AS "gfw_gross_emissions_co2e_non_co2__Mg", SUM("gfw_gross_emissions_co2e_co2_only__Mg") AS "gfw_gross_emissions_co2e_co2_only__Mg" FROM data {WHERE} GROUP BY umd_tree_cover_loss__year, {location} ORDER BY umd_tree_cover_loss__year, {location}',
  emissionsByDriver:
    'SELECT tsc_tree_cover_loss_drivers__type, umd_tree_cover_loss__year, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", SUM("gfw_gross_emissions_co2e_non_co2__Mg") AS "gfw_gross_emissions_co2e_non_co2__Mg", SUM("gfw_gross_emissions_co2e_co2_only__Mg") AS "gfw_gross_emissions_co2e_co2_only__Mg" FROM data {WHERE} GROUP BY tsc_tree_cover_loss_drivers__type, umd_tree_cover_loss__year',
  carbonFlux:
    'SELECT SUM("gfw_net_flux_co2e__Mg") AS "gfw_net_flux_co2e__Mg", SUM("gfw_gross_cumulative_aboveground_belowground_co2_removals__Mg") AS "gfw_gross_cumulative_aboveground_belowground_co2_removals__Mg", SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", TRUE AS "includes_gain_pixels" FROM data {WHERE}',
  extent:
    'SELECT {select_location}, SUM(umd_tree_cover_extent_{extentYear}__ha) AS umd_tree_cover_extent_{extentYear}__ha, SUM(area__ha) AS area__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  gain:
    'SELECT {select_location}, SUM("umd_tree_cover_gain_2000-2012__ha") AS "umd_tree_cover_gain_2000-2012__ha", SUM(umd_tree_cover_extent_2000__ha) AS umd_tree_cover_extent_2000__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  areaIntersection:
    'SELECT {select_location}, SUM(area__ha) AS area__ha {intersection} FROM data {WHERE} GROUP BY {location} {intersection} ORDER BY area__ha DESC',
  glad:
    'SELECT {select_location}, alert__year, alert__week, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} GROUP BY {location}, alert__year, alert__week',
  gladDaily: `SELECT {select_location}, alert__date, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} AND alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY {location}, alert__date ORDER BY alert__date DESC`,
  fires:
    'SELECT {select_location}, alert__year, alert__week, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} GROUP BY {location}, alert__year, alert__week, confidence__cat',
  burnedAreas:
    'SELECT {select_location}, alert__year, alert__week, SUM(burned_area__ha) AS burn_area__ha FROM data {WHERE} AND umd_tree_cover_density__threshold >= 0 GROUP BY {location}, alert__year, alert__week',
  firesGrouped:
    'SELECT {select_location}, alert__year, alert__week, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND ({dateFilter}) GROUP BY {location}, alert__year, alert__week, confidence__cat',
  firesWithin:
    'SELECT {select_location}, alert__week, alert__year, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND alert__year >= {alert__year} AND alert__week >= 1 GROUP BY {location}, alert__year, alert__week, confidence__cat ORDER BY alert__week DESC, alert__year DESC',
  nonGlobalDatasets:
    'SELECT {polynames} FROM polyname_whitelist WHERE iso is null AND adm1 is null AND adm2 is null',
  getLocationPolynameWhitelist:
    'SELECT {select_location}, {polynames} FROM data {WHERE}',
  alertsWeekly:
    'SELECT alert__week, alert__year, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND ({dateFilter}) GROUP BY alert__week, alert__year, confidence__cat ORDER BY alert__year DESC, alert__week DESC',
  alertsDaily:
    "SELECT alert__date, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY alert__date, confidence__cat ORDER BY alert__date DESC",
  biomassStock:
    'SELECT SUM("whrc_aboveground_biomass_stock_2000__Mg") AS "whrc_aboveground_biomass_stock_2000__Mg", SUM("whrc_aboveground_co2_stock_2000__Mg") AS "whrc_aboveground_co2_stock_2000__Mg", SUM(umd_tree_cover_extent_2000__ha) AS umd_tree_cover_extent_2000__ha FROM data {WHERE}',
  biomassStockGrouped:
    'SELECT {select_location}, SUM("whrc_aboveground_biomass_stock_2000__Mg") AS "whrc_aboveground_biomass_stock_2000__Mg", SUM("whrc_aboveground_co2_stock_2000__Mg") AS "whrc_aboveground_co2_stock_2000__Mg", SUM(umd_tree_cover_extent_2000__ha) AS umd_tree_cover_extent_2000__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
};

const ALLOWED_PARAMS = {
  annual: ['adm0', 'adm1', 'adm2', 'threshold', 'forestType', 'landCategory'],
  glad: [
    'adm0',
    'adm1',
    'adm2',
    'forestType',
    'landCategory',
    'is__confirmed_alert',
  ],
  viirs: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence'],
  modis: ['adm0', 'adm1', 'adm2', 'forestType', 'landCategory', 'confidence'],
  modis_burned_area: [
    'adm0',
    'adm1',
    'adm2',
    'forestType',
    'landCategory',
    'confidence',
  ],
};

//
// function for building analysis table queries from params
//

const typeByGrouped = {
  global: {
    default: 'adm0',
    grouped: 'adm0',
  },
  adm0: {
    default: 'adm0',
    grouped: 'adm1',
  },
  adm1: {
    default: 'adm1',
    grouped: 'adm2',
  },
  adm2: {
    default: 'adm2',
    grouped: 'adm2',
  },
};

export const getIndicator = (activeForestType, activeLandCategory, ifl) => {
  const forestType = forestTypes.find((f) => f.value === activeForestType);
  const landCategory = landCategories.find(
    (f) => f.value === activeLandCategory
  );
  if (!forestType && !landCategory) return null;
  let label = '';
  let value = '';
  let forestTypeLabel = (forestType && forestType.label) || '';
  let landCatLabel = (landCategory && landCategory.label) || '';

  forestTypeLabel =
    forestType && forestType.preserveString === true
      ? forestTypeLabel
      : forestTypeLabel.toLowerCase();
  landCatLabel =
    landCategory && landCategory.preserveString === true
      ? landCatLabel
      : landCatLabel.toLowerCase();

  if (forestType && landCategory) {
    label = `${forestTypeLabel} in ${landCatLabel}`;
    value = `${forestType.value}__${landCategory.value}`;
  } else if (landCategory) {
    label = landCatLabel;
    value = landCategory.value;
  } else {
    label = forestTypeLabel;
    value = forestType.value;
  }

  return {
    label: label.replace('({iflyear})', ifl),
    value,
  };
};

// build the base query for the query with the correct dataset id
const getRequestUrl = ({
  type,
  adm1,
  adm2,
  dataset,
  datasetType,
  grouped,
  version,
}) => {
  let typeByLevel = type;
  if (type === 'country' || type === 'global') {
    if (!adm1) typeByLevel = 'adm0';
    if (adm1) typeByLevel = 'adm1';
    if (adm2 || datasetType === 'daily') typeByLevel = 'adm2';
    typeByLevel = typeByGrouped[typeByLevel][grouped ? 'grouped' : 'default'];
  }
  const datasetId =
    DATASETS[
      `${dataset?.toUpperCase()}_${typeByLevel?.toUpperCase()}_${datasetType?.toUpperCase()}`
    ];

  if (typeof datasetId === 'undefined') {
    // @TODO: Figure out why widgets are stale on loading, when not requesting info
    // return null;
  }
  return `${GFW_DATA_API_PROXY}/dataset/${datasetId}/${
    version || 'latest'
  }/query?sql=`;
};

const getDownloadUrl = (url) => {
  try {
    const queryUrl = new URL(url);
    queryUrl.pathname = queryUrl.pathname.replace('query', 'download/csv');
    return queryUrl.toString();
  } catch {
    return null; // invalid url, front end should deal with this
  }
};

// build {select} from location params
const getLocationSelect = ({ type, adm0, adm1, adm2, grouped, cast }) => {
  if (type === 'wdpa') return 'wdpa_protected_area__id';
  if (['geostore', 'use'].includes(type)) return 'geostore__id';

  let locationString = `iso${adm1 ? ', adm1{castTemplate}' : ''}${
    adm2 ? ', adm2{castTemplate}' : ''
  }`;
  const castString = cast ? '::integer' : '';
  if (grouped)
    locationString = `iso${adm0 ? ', adm1{castTemplate}' : ''}${
      adm1 ? ', adm2{castTemplate}' : ''
    }`;
  return locationString.replace(/{castTemplate}/g, castString);
};

// build {where} statement for query
export const getWHEREQuery = (params) => {
  const allPolynames = forestTypes.concat(landCategories);
  const paramKeys = params && Object.keys(params);
  const allowedParams = ALLOWED_PARAMS[params.dataset || 'annual'];
  const paramKeysFiltered = paramKeys.filter(
    (p) => (params[p] || p === 'threshold') && allowedParams.includes(p)
  );
  const { type, dataset } = params || {};
  if (paramKeysFiltered && paramKeysFiltered.length) {
    let paramString = 'WHERE ';
    paramKeysFiltered.forEach((p, i) => {
      const isLast = paramKeysFiltered.length - 1 === i;
      const isPolyname = ['forestType', 'landCategory'].includes(p);
      const value = isPolyname ? 1 : params[p];
      const polynameMeta = allPolynames.find(
        (pname) => pname.value === params[p]
      );
      const tableKey =
        polynameMeta &&
        (polynameMeta.tableKey || polynameMeta.tableKeys[dataset || 'annual']);

      /* TODO
       perform better casting / allow to configure types:
       AS for example wdpa_protected_area__id needs to be a string,
       even that it evaluates AS a number.
       Note that the postgres tables will allow us to cast at the query level.
      */
      // const zeroString = polynameMeta?.dataType === 'keyword' ? "'0'" : '0';
      let isNumericValue = !!(
        typeof value === 'number' ||
        (!isNaN(value) && !['adm0', 'confidence'].includes(p))
      );

      let paramKey = p;
      if (p === 'confidence') paramKey = 'confidence__cat';
      if (p === 'threshold') paramKey = 'umd_tree_cover_density__threshold';
      if (p === 'adm0' && type === 'country') paramKey = 'iso';
      if (p === 'adm1' && type === 'country') paramKey = 'adm1::integer';
      if (p === 'adm2' && type === 'country') paramKey = 'adm2::integer';
      if (p === 'adm0' && type === 'geostore') paramKey = 'geostore__id';
      if (p === 'adm0' && type === 'wdpa') {
        paramKey = 'wdpa_protected_area__id';
        isNumericValue = false;
      }

      const polynameString = `
        ${
          isPolyname && tableKey.includes('is__') ? `${tableKey} = 'true'` : ''
        }${
        isPolyname && !tableKey.includes('is__')
          ? `${tableKey} IS NOT NULL`
          : ''
      }${
        isPolyname &&
        polynameMeta &&
        !tableKey.includes('is__') &&
        polynameMeta.default &&
        polynameMeta.categories
          ? ` AND ${tableKey} ${polynameMeta.comparison || '='} ${
              polynameMeta?.dataType === 'keyword'
                ? `'${polynameMeta?.default}'`
                : `${polynameMeta?.default}`
            }`
          : ''
      }${
        !isPolyname
          ? `${paramKey} = ${isNumericValue ? value : `'${value}'`}`
          : ''
      }${isLast ? '' : ' AND '}`;

      paramString = paramString.concat(polynameString);
    });
    return paramString;
  }
  return '';
};

export const getDatesFilter = ({ startDate }) => {
  const startYear = startDate
    ? moment(startDate).year()
    : moment().subtract(1, 'weeks').year();

  const startWeek = startDate
    ? moment(startDate).isoWeek()
    : moment().subtract(1, 'weeks').isoWeek();

  return `(alert__year = ${startYear} AND alert__week >= ${startWeek}) OR alert__year >= ${startYear}`;
};

// build complex WHERE filter for dates (VIIRS/GLAD)
export const getWeeksFilter = ({ weeks, latest }) => {
  const latestYear = latest
    ? moment(latest).year()
    : moment().subtract(1, 'weeks').year();

  const latestWeek = latest
    ? moment(latest).isoWeek()
    : moment().subtract(1, 'weeks').isoWeek();

  const years = [];
  for (let i = VIIRS_START_YEAR; i <= latestYear; i += 1) {
    years.push(i);
  }

  const weekFilters = years.map((year) => {
    const endDate = moment().isoWeek(latestWeek).year(year);

    const startDate = moment()
      .isoWeek(latestWeek)
      .year(year)
      .subtract(weeks, 'week');

    const startYear = startDate.year();
    const endYear = endDate.year();
    const startWeek = startDate.isoWeek();
    const endWeek = endDate.isoWeek();

    return {
      startYear: startYear < VIIRS_START_YEAR ? VIIRS_START_YEAR : startYear,
      startWeek: startYear < VIIRS_START_YEAR ? 1 : startWeek,
      endYear,
      endWeek,
    };
  });

  return weekFilters.reduce((acc, d, i) => {
    const yi = d.startYear || '';
    const wi = d.startWeek || '';
    const yf = d.endYear || '';
    const wf = d.endWeek || '';

    return `${acc} ${
      i === 0 ? '' : 'OR '
    }((alert__year = ${yi} AND alert__week > ${wi}) ${
      wi < wf ? 'AND' : 'OR'
    } (alert__year = ${yf} AND alert__week <= ${wf}))`;
  }, '');
};

//
// data fetches
//

// summed loss for single location
export const getLoss = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};
  const { loss, lossTsc } = SQL_QUERIES;
  const query = params.lossTsc ? lossTsc : loss;

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${query}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        bound1: d.tsc_tree_cover_loss_drivers__type,
        year: d.umd_tree_cover_loss__year,
        area: d.umd_tree_cover_loss__ha,
        emissions: d.gfw_gross_emissions_co2e_all_gases__Mg,
      })),
    },
  }));
};

// summed loss for single location
export const getEmissions = (params) => {
  const { forestType, landCategory, ifl, download, byDriver } = params || {};
  const { emissions, emissionsByDriver } = SQL_QUERIES;
  const query = byDriver ? emissionsByDriver : emissions;
  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${query}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `Forest_related_GHG_emissions${
        byDriver ? '_by_dominant_driver' : ''
      }${indicator ? `_in_${snakeCase(indicator.label)}` : ''}`,
      url: getDownloadUrl(url),
    };
  }
  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        bound1: d.tsc_tree_cover_loss_drivers__type,
        year: d.umd_tree_cover_loss__year,
        allGases: d.gfw_gross_emissions_co2e_all_gases__Mg,
        co2Only: d.gfw_gross_emissions_co2e_co2_only__Mg,
        nonCo2Gases: d.gfw_gross_emissions_co2e_non_co2__Mg,
      })),
    },
  }));
};

// summed loss for single location
export const getCarbonFlux = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};
  const { carbonFlux } = SQL_QUERIES;
  const url = encodeURI(
    `${getRequestUrl({
      ...params,
      dataset: 'annual',
      datasetType: 'summary',
    })}${carbonFlux}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `Forest_related_net_carbon_flux${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then(({ data: { data } }) =>
    data.map((d) => ({
      removals:
        -d.gfw_gross_cumulative_aboveground_belowground_co2_removals__Mg || 0,
      emissions: d.gfw_gross_emissions_co2e_all_gases__Mg || 0,
      flux: d.gfw_net_flux_co2e__Mg || 0,
    }))
  );
};

// disaggregated loss for child of location
export const getLossGrouped = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.loss}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: true })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        area: d.umd_tree_cover_loss__ha,
        emissions: d.gfw_gross_emissions_co2e_all_gases__Mg,
      })),
    },
  }));
};

// summed extent for single location
export const getExtent = (params) => {
  const { forestType, landCategory, ifl, download, extentYear } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.extent}`
      .replace(/{extentYear}/g, extentYear)
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_${extentYear}${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }
  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        extent: d[`umd_tree_cover_extent_${extentYear}__ha`],
        total_area: d.area__ha,
      })),
    },
  }));
};

// disaggregated extent for child of location
export const getExtentGrouped = (params) => {
  const { forestType, landCategory, ifl, download, extentYear } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.extent}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: true })
      )
      .replace(/{extentYear}/g, extentYear)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_${extentYear}_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        extent: d[`umd_tree_cover_extent_${extentYear}__ha`],
        total_area: d.area__ha,
      })),
    },
  }));
};

// summed gain for single location
export const getGain = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.gain}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_gain_2000-2012${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        gain: d['umd_tree_cover_gain_2000-2012__ha'],
      })),
    },
  }));
};

// disaggregated gain for child of location
export const getGainGrouped = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.gain}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: true })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_gain_2000-2012_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        gain: d['umd_tree_cover_gain_2000-2012__ha'],
      })),
    },
  }));
};

// total area for a given of polyname in location
export const getAreaIntersection = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};
  const intersectionPolyname = forestTypes
    .concat(landCategories)
    .find((o) => [forestType, landCategory].includes(o.value));

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.areaIntersection}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(
        /{intersection}/g,
        `, ${intersectionPolyname.tableKey}` ||
          `, ${intersectionPolyname.tableKeys.annual}`
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_in_${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        intersection_area: d.area__ha,
        [forestType || landCategory]:
          d[intersectionPolyname.tableKey] ||
          d[intersectionPolyname.tableKeys.annual],
      })),
    },
  }));
};

// total area for a given of polyname in location
export const getAreaIntersectionGrouped = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};
  const intersectionPolyname = forestTypes
    .concat(landCategories)
    .find((o) => [forestType, landCategory].includes(o.value));

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.areaIntersection}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: true })
      )
      .replace(
        /{intersection}/g,
        intersectionPolyname
          ? `, ${intersectionPolyname.tableKey}` ||
              `, ${intersectionPolyname.tableKeys.annual}`
          : ''
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_extent_in_${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }_by_region__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        intersection_area: d.area__ha,
        ...(intersectionPolyname && {
          [forestType || landCategory]:
            d[intersectionPolyname.tableKey] ||
            d[intersectionPolyname.tableKeys.annual],
        }),
      })),
    },
  }));
};

export const fetchHistoricalAlerts = (params) => {
  const {
    forestType,
    frequency,
    landCategory,
    ifl,
    download,
    startDate,
    endDate,
    dataset,
  } = params || {};
  const { alertsDaily, alertsWeekly } = SQL_QUERIES;

  const requestUrl = getRequestUrl({
    ...params,
    datasetType: frequency,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${frequency === 'daily' ? alertsDaily : alertsWeekly}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery(params))
      .replace(/{dateFilter}/g, getDatesFilter(params))
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `${dataset}_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }
  return apiRequest.get(url).then((response) => ({
    data: {
      frequency,
      data: response.data.data.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10) || null,
        year: parseInt(d.alert__year, 10) || null,
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha,
      })),
    },
  }));
};

export const fetchHistoricalGladAlerts = (params) => {
  const { forestType, landCategory, ifl, download, startDate, endDate } =
    params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'glad',
    datasetType: 'daily',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.gladDaily}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `glad_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        date: d.alert__date,
        count: d.alert__count,
        alerts: d.alert__count,
        year: moment(d.alert__date).year(),
        week: moment(d.alert__date).week(),
        area_ha: d.alert_area__ha,
      })),
    },
  }));
};

export const fetchGladAlerts = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'glad',
    datasetType: 'weekly',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.glad}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `glad_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha,
      })),
    },
  }));
};

// Latest Dates for Alerts
const lastFriday = moment().day(-2).format('YYYY-MM-DD');

export const fetchGLADLatest = () => {
  const url = '/glad-alerts/latest';
  return apiRequest
    .get(url)
    .then((response) => {
      const { date } = response.data.data[0].attributes;

      return {
        attributes: { updatedAt: date },
        id: null,
        type: 'glad-alerts',
      };
    })
    .catch(
      () =>
        new Promise((resolve) =>
          resolve({
            attributes: { updatedAt: lastFriday },
            id: null,
            type: 'glad-alerts',
          })
        )
    );
};

export const fetchFires = (params) => {
  const { forestType, landCategory, ifl, download, dataset } = params || {};
  const isBurnedArea = dataset === 'modis_burned_area';
  // @TODO: this is not elegant, remove and find a better way
  if (isBurnedArea) delete params.confidence;
  const queryString = isBurnedArea
    ? SQL_QUERIES.burnedAreas
    : SQL_QUERIES.fires;
  const url = encodeURI(
    `${getRequestUrl({
      ...params,
      dataset,
      datasetType: 'weekly',
      version: isBurnedArea ? 'v20210609' : 'latest',
    })}${queryString}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset }))
  );
  if (download) {
    const fileName = isBurnedArea
      ? dataset
      : `${dataset || 'viirs'}_fire_alerts`;
    const unit = isBurnedArea ? 'ha' : 'count';
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `${fileName}${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__${unit}`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        area_ha: d.burn_area__ha,
      })),
    },
  }));
};

export const fetchVIIRSAlerts = (params) => {
  const { forestType, landCategory, ifl, download, dataset } = params || {};
  const url = encodeURI(
    `${getRequestUrl({ ...params, dataset, datasetType: 'weekly' })}${
      SQL_QUERIES.fires
    }`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `${dataset || 'viirs'}_fire_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha,
      })),
    },
  }));
};

export const fetchVIIRSAlertsGrouped = (params) => {
  const { forestType, landCategory, ifl, download, dataset } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset,
    datasetType: 'weekly',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.firesGrouped}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: true })
      )
      .replace(/{dateFilter}/g, getWeeksFilter(params))
      .replace(
        '{WHERE}',
        getWHEREQuery({ ...params, dataset: 'viirs', grouped: true })
      )
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `${dataset || 'viirs'}_fire_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
      })),
    },
  }));
};

export const fetchFiresWithin = (params) => {
  const { forestType, landCategory, ifl, download, dataset, weeks } =
    params || {};
  const filterYear = moment().subtract(weeks, 'weeks').year();
  const url = encodeURI(
    `${getRequestUrl({ ...params, dataset, datasetType: 'weekly' })}${
      SQL_QUERIES.firesWithin
    }`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset }))
      .replace('{alert__year}', filterYear)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `${dataset || 'viirs'}_fire_alerts${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
      })),
    },
  }));
};

export const fetchVIIRSLatest = () =>
  tilesRequest
    .get('/nasa_viirs_fire_alerts/latest/max_alert__date')
    .then(({ data }) => {
      const date = data && data.data && data.data.max_date;

      return {
        date,
      };
    })
    .catch(() => ({
      date: moment().utc().subtract('weeks', 2).format('YYYY-MM-DD'),
    }));

// Climate fetches

// whrc biomass grouped by location
export const getBiomassStockGrouped = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.biomassStockGrouped}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: true })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `whrc_biomass_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        biomass: d.whrc_aboveground_biomass_stock_2000__Mg,
        carbon: d.whrc_aboveground_co2_stock_2000__Mg,
      })),
    },
  }));
};

// whrc biomass
export const getBiomassStock = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.biomassStock}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `whrc_biomass_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return apiRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        biomass: d.whrc_aboveground_biomass_stock_2000__Mg,
        carbon: d.whrc_aboveground_co2_stock_2000__Mg,
      })),
    },
  }));
};

// Additional conditional fetches for providing context for queries.

// generate {select} query using all available forest types and land categories
const buildPolynameSelects = (nonTable, dataset) => {
  const allPolynames = forestTypes
    .concat(landCategories)
    .filter((p) => !p.hidden);
  let polyString = '';
  allPolynames.forEach((p, i) => {
    const isLast = i === allPolynames.length - 1;
    polyString = polyString.concat(
      `${!nonTable ? p.tableKey || p.tableKeys[dataset] : p.value}, ${
        !nonTable ? p.tableKey || p.tableKeys[dataset] : p.value
      } AS ${p.value}${isLast ? '' : ', '}`
    );
  });
  return polyString;
};

// get counts of countries that each forest type and land category intersects with
export const getNonGlobalDatasets = () => {
  const url = `/sql?q=${SQL_QUERIES.nonGlobalDatasets}`.replace(
    '{polynames}',
    buildPolynameSelects(true, 'annual')
  );
  return cartoRequest.get(url);
};

// get a boolean list of forest types and land categories inside a given shape
export const getLocationPolynameWhitelist = (params) => {
  const url = `${getRequestUrl({ ...params, datasetType: 'whitelist' })}${
    SQL_QUERIES.getLocationPolynameWhitelist
  }`
    .replace(/{select_location}/g, getLocationSelect({ ...params, cast: true }))
    .replace(/{location}/g, getLocationSelect(params))
    .replace(
      '{polynames}',
      buildPolynameSelects(false, params.dataset || 'annual')
    )
    .replace('{WHERE}', getWHEREQuery(params));

  return apiRequest.get(url);
};
