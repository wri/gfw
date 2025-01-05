import qs from 'qs';
import { cartoRequest, dataMartRequest, dataRequest } from 'utils/request';
import { PROXIES } from 'utils/proxies';

import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';
import DATASETS from 'data/analysis-datasets.json';
import DATASETS_VERSIONS from 'data/analysis-datasets-versions.json';

import snakeCase from 'lodash/snakeCase';
import moment from 'moment';

import { getWHEREQuery } from './get-where-query';

const VIIRS_START_YEAR = 2012;

const SQL_QUERIES = {
  // This Query is used by the treeLossTsc (pie chart version) widget (_tree-loss-drivers), which had its rollout paused.
  treeCoverLossByDriver:
    'SELECT tsc_tree_cover_loss_drivers__type as driver_type, SUM(umd_tree_cover_loss__ha) AS loss_area_ha FROM data {WHERE} AND tsc_tree_cover_loss_drivers__type IS NOT NULL GROUP BY tsc_tree_cover_loss_drivers__type',
  lossTsc:
    'SELECT tsc_tree_cover_loss_drivers__driver, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg" FROM data {WHERE} GROUP BY tsc_tree_cover_loss_drivers__driver, umd_tree_cover_loss__year',
  loss: 'SELECT {select_location}, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg" FROM data {WHERE} GROUP BY umd_tree_cover_loss__year, {location} ORDER BY umd_tree_cover_loss__year, {location}',
  lossNaturalForest: `SELECT {select_location}, sbtn_natural_forests__class, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS gfw_gross_emissions_co2e_all_gases__Mg FROM data {WHERE} GROUP BY sbtn_natural_forests__class, umd_tree_cover_loss__year, {location}`,
  lossFires:
    'SELECT {select_location}, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM(umd_tree_cover_loss_from_fires__ha) AS "umd_tree_cover_loss_from_fires__ha" FROM data {WHERE} GROUP BY umd_tree_cover_loss__year, {location} ORDER BY umd_tree_cover_loss__year, {location}',
  lossFiresOTF:
    'SELECT umd_tree_cover_loss__year, sum(umd_tree_cover_loss__ha), sum(umd_tree_cover_loss_from_fires__ha) FROM data WHERE umd_tree_cover_loss__year >= {startYear} AND umd_tree_cover_loss__year <= {endYear} AND umd_tree_cover_density_2000__threshold >= {threshold} GROUP BY umd_tree_cover_loss__year',
  emissions:
    'SELECT {select_location}, umd_tree_cover_loss__year, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", SUM("gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e") AS "gfw_gross_emissions_co2e_non_co2__Mg", SUM("gfw_full_extent_gross_emissions_CO2_only__Mg_CO2") AS "gfw_gross_emissions_co2e_co2_only__Mg" FROM data {WHERE} GROUP BY umd_tree_cover_loss__year, {location} ORDER BY umd_tree_cover_loss__year, {location}',
  emissionsLossOTF:
    'SELECT umd_tree_cover_loss__year, SUM(area__ha), SUM("gfw_forest_carbon_gross_emissions__Mg_CO2e") FROM data WHERE umd_tree_cover_density_2000__threshold >= {threshold} AND umd_tree_cover_loss__year >= {startYear} AND umd_tree_cover_loss__year <= {endYear} GROUP BY umd_tree_cover_loss__year ORDER BY umd_tree_cover_loss__year&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}',
  emissionsByDriver:
    'SELECT tsc_tree_cover_loss_drivers__driver, umd_tree_cover_loss__year, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", SUM("gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e") AS "gfw_gross_emissions_co2e_non_co2__Mg", SUM("gfw_full_extent_gross_emissions_CO2_only__Mg_CO2") AS "gfw_gross_emissions_co2e_co2_only__Mg" FROM data {WHERE} GROUP BY tsc_tree_cover_loss_drivers__driver, umd_tree_cover_loss__year',
  carbonFlux:
    'SELECT SUM("gfw_net_flux_co2e__Mg") AS "gfw_net_flux_co2e__Mg", SUM("gfw_gross_cumulative_aboveground_belowground_co2_removals__Mg") AS "gfw_gross_cumulative_aboveground_belowground_co2_removals__Mg", SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", TRUE AS "includes_gain_pixels" FROM data {WHERE}',
  carbonFluxOTF: `SELECT SUM("gfw_forest_carbon_net_flux__Mg_CO2e"), SUM("gfw_forest_carbon_gross_removals__Mg_CO2e"), SUM("gfw_forest_carbon_gross_emissions__Mg_CO2e") FROM data WHERE umd_tree_cover_density_2000__threshold >= {threshold} OR is__umd_tree_cover_gain = 'true'&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}`,
  extent:
    'SELECT {select_location}, SUM(umd_tree_cover_extent_{extentYear}__ha) AS umd_tree_cover_extent_{extentYear}__ha, SUM(area__ha) AS area__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  extentNaturalForest: `SELECT {select_location}, sbtn_natural_forests__class, SUM(area__ha) AS area__ha FROM data {WHERE} GROUP BY iso, sbtn_natural_forests__class, {location} ORDER BY {location}`,
  gain: `SELECT {select_location}, SUM("umd_tree_cover_gain__ha") AS "umd_tree_cover_gain__ha", SUM(umd_tree_cover_extent_2000__ha) AS umd_tree_cover_extent_2000__ha FROM data {WHERE} AND umd_tree_cover_gain__period in ({baselineYear}) GROUP BY {location} ORDER BY {location}`,
  areaIntersection:
    'SELECT {select_location}, SUM(area__ha) AS area__ha {intersection} FROM data {WHERE} GROUP BY {location} {intersection} ORDER BY area__ha DESC',
  glad: 'SELECT {select_location}, alert__year, alert__week, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} GROUP BY {location}, alert__year, alert__week',
  integratedAlertsDaily: `SELECT {select_location}, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha, {confidenceString} FROM data {WHERE} AND {dateString} >= '{startDate}' AND {dateString} <= '{endDate}' GROUP BY {location}, {confidenceString}`,
  integratedAlertsRanked: `SELECT {select_location}, {alertTypeColumn}, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} AND {alertTypeColumn} >= '{startDate}' AND {alertTypeColumn} <= '{endDate}' GROUP BY {location}, {alertTypeColumn} ORDER BY {alertTypeColumn} DESC`,
  integratedAlertsDailyDownload: `SELECT latitude, longitude, gfw_integrated_alerts__date, umd_glad_landsat_alerts__confidence, umd_glad_sentinel2_alerts__confidence, wur_radd_alerts__confidence, gfw_integrated_alerts__confidence FROM data WHERE gfw_integrated_alerts__date >= '{startDate}' AND gfw_integrated_alerts__date <= '{endDate}'{AND_OPERATION}&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}`,
  integratedAlertsDownloadGladL: `SELECT latitude, longitude, umd_glad_landsat_alerts__date, umd_glad_landsat_alerts__confidence FROM data WHERE umd_glad_landsat_alerts__date >= '{startDate}' AND umd_glad_landsat_alerts__date <= '{endDate}'{AND_OPERATION}&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}`,
  integratedAlertsDownloadGladS: `SELECT latitude, longitude, umd_glad_sentinel2_alerts__date, umd_glad_sentinel2_alerts__confidence FROM data WHERE umd_glad_sentinel2_alerts__date >= '{startDate}' AND umd_glad_sentinel2_alerts__date <= '{endDate}'{AND_OPERATION}&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}`,
  integratedAlertsDownloadRadd: `SELECT latitude, longitude, wur_radd_alerts__date, wur_radd_alerts__confidence FROM data WHERE wur_radd_alerts__date >= '{startDate}' AND wur_radd_alerts__date <= '{endDate}'{AND_OPERATION}&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}`,
  gladDaily: `SELECT {select_location}, alert__date, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} AND alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY {location}, alert__date ORDER BY alert__date DESC`,
  gladDailySum: `SELECT {select_location}, is__confirmed_alert, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} AND alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY {location}, is__confirmed_alert`,
  gladDailyOTF: `SELECT latitude, longitude, umd_glad_landsat_alerts__date, umd_glad_landsat_alerts__confidence FROM data WHERE umd_glad_landsat_alerts__date >= '{startDate}' AND umd_glad_landsat_alerts__date <= '{endDate}' GROUP BY latitude, longitude, umd_glad_landsat_alerts__date&geostore_origin={geostoreOrigin}&geostore_id={geostoreId}`,
  fires:
    'SELECT {select_location}, alert__year, alert__week, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} GROUP BY {location}, alert__year, alert__week, confidence__cat',
  burnedAreas:
    'SELECT {select_location}, alert__year, alert__week, SUM(burned_area__ha) AS burn_area__ha FROM data {WHERE} GROUP BY {location}, alert__year, alert__week',
  firesGrouped:
    'SELECT {select_location}, alert__year, alert__week, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} {dateFilter} GROUP BY {location}, alert__year, alert__week, confidence__cat',
  burnedAreaGrouped:
    'SELECT {select_location}, alert__year, alert__week, SUM(burned_area__ha) AS burned_area__ha FROM data {WHERE} {dateFilter} GROUP BY {location}, alert__year, alert__week',
  firesWithin:
    'SELECT {select_location}, alert__week, alert__year, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND alert__year >= {alert__year} AND alert__week >= 1 GROUP BY alert__year, alert__week ORDER BY alert__week DESC, alert__year DESC',
  firesDailySum: `SELECT {select_location}, confidence__cat, SUM(alert__count) AS alert__count FROM data {WHERE} AND alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY {location}, confidence__cat`,
  firesDailySumOTF: `SELECT SUM(alert__count) AS alert__count, confidence__cat FROM data WHERE alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY confidence__cat&geostore_id={geostoreId}&geostore_origin=rw`,
  nonGlobalDatasets:
    'SELECT {polynames} FROM polyname_whitelist WHERE iso is null AND adm1 is null AND adm2 is null',
  getLocationPolynameWhitelist:
    'SELECT {select_location}, {polynames} FROM data {WHERE}',
  alertsWeekly:
    'SELECT alert__week, alert__year, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND ({dateFilter}) GROUP BY alert__week, alert__year, confidence__cat ORDER BY alert__year DESC, alert__week DESC',
  alertsDaily:
    "SELECT alert__date, SUM(alert__count) AS alert__count, confidence__cat FROM data {WHERE} AND alert__date >= '{startDate}' AND alert__date <= '{endDate}' GROUP BY alert__date, confidence__cat ORDER BY alert__date DESC",
  historicalIntegratedAlertsDaily:
    "SELECT gfw_integrated_alerts__date, SUM(alert__count) AS alert__count, gfw_integrated_alerts__confidence FROM data {WHERE} AND gfw_integrated_alerts__date >= '{startDate}' AND gfw_integrated_alerts__date <= '{endDate}' GROUP BY gfw_integrated_alerts__date, gfw_integrated_alerts__confidence ORDER BY gfw_integrated_alerts__date DESC",
  biomassStock:
    'SELECT SUM("whrc_aboveground_biomass_stock_2000__Mg") AS "whrc_aboveground_biomass_stock_2000__Mg", SUM("whrc_aboveground_co2_stock_2000__Mg") AS "whrc_aboveground_co2_stock_2000__Mg", SUM(umd_tree_cover_extent_2000__ha) AS umd_tree_cover_extent_2000__ha, SUM("gfw_aboveground_carbon_stocks_2000__Mg_C") as gfw_aboveground_carbon_stocks_2000__Mg_C, SUM("gfw_belowground_carbon_stocks_2000__Mg_C") as gfw_belowground_carbon_stocks_2000__Mg_C, SUM("gfw_soil_carbon_stocks_2000__Mg_C") as gfw_soil_carbon_stocks_2000__Mg_C FROM data {WHERE}',
  biomassStockGrouped:
    'SELECT {select_location}, SUM("whrc_aboveground_biomass_stock_2000__Mg") AS "whrc_aboveground_biomass_stock_2000__Mg", SUM("whrc_aboveground_co2_stock_2000__Mg") AS "whrc_aboveground_co2_stock_2000__Mg", SUM(umd_tree_cover_extent_2000__ha) AS umd_tree_cover_extent_2000__ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  organicSoilCarbon:
    'SELECT {location}, SUM("gfw_soil_carbon_stocks_2000__Mg_C") as gfw_soil_carbon_stocks_2000__Mg_C, SUM("gfw_soil_carbon_stocks_2000__Mg_C") / SUM("umd_tree_cover_extent_2000__ha") as gfw_soil_carbon_density__t_C_per_ha, SUM("gfw_aboveground_carbon_stocks_2000__Mg_C") / SUM("umd_tree_cover_extent_2000__ha") AS gfw_aboveground_carbon_stocks_2000__t_C_per_ha, SUM("gfw_belowground_carbon_stocks_2000__Mg_C") / SUM("umd_tree_cover_extent_2000__ha") as gfw_belowground_carbon_stocks_2000__t_C_per_ha FROM data {WHERE} GROUP BY {location}',
  organicSoilCarbonGrouped:
    'SELECT {select_location}, CASE WHEN SUM("umd_tree_cover_extent_2000__ha") = 0 THEN NULL ELSE SUM("gfw_soil_carbon_stocks_2000__Mg_C") END AS "gfw_soil_carbon_stocks_2000__Mg_C", CASE WHEN SUM("umd_tree_cover_extent_2000__ha") = 0 THEN NULL ELSE SUM("gfw_soil_carbon_stocks_2000__Mg_C") / SUM("umd_tree_cover_extent_2000__ha") END AS soil_carbon_density__t_ha FROM data {WHERE} GROUP BY {location} ORDER BY {location}',
  treeCoverGainByPlantationType: `SELECT CASE WHEN gfw_planted_forests__type IS NULL THEN 'Outside of Plantations' ELSE gfw_planted_forests__type END AS plantation_type, SUM(umd_tree_cover_gain__ha) as gain_area_ha FROM data {WHERE} AND umd_tree_cover_gain__period in ({baselineYear}) GROUP BY gfw_planted_forests__type`,
  treeCoverOTF:
    'SELECT SUM(area__ha) FROM data WHERE umd_tree_cover_density_2000__threshold >= {threshold}&geostore_id={geostoreId}',
  treeCoverOTFExtent: 'SELECT SUM(area__ha) FROM data&geostore_id={geostoreId}',
  treeCoverGainSimpleOTF:
    'SELECT SUM(area__ha) FROM data&geostore_id={geostoreId}',
  naturalForest:
    'SELECT {location}, sbtn_natural_forests__class, SUM(area__ha) AS area__ha FROM data {WHERE} GROUP BY {location}, sbtn_natural_forests__class',
  netChangeIso:
    'SELECT {select_location}, stable, loss, gain, disturb, net, change, gfw_area__ha FROM data {WHERE}',
  netChange:
    'SELECT {select_location}, {select_location}_name, stable, loss, gain, disturb, net, change, gfw_area__ha FROM data {WHERE}',
  tropicalExtent:
    'SELECT {select_location}, SUM(CASE WHEN wri_tropical_tree_cover__decile >= {decile} THEN wri_tropical_tree_cover_extent__ha END) AS tropical_tree_cover_extent_2020_ha, SUM(CASE WHEN wri_tropical_tree_cover__decile >= 0 THEN area__ha END) AS area__ha FROM data {WHERE} GROUP BY {location} HAVING SUM(CASE WHEN wri_tropical_tree_cover__decile >= 0 THEN area__ha END) > 0 ORDER BY {location}',
  treeCoverByLandCoverClass:
    'SELECT {select_location}, umd_global_land_cover__ipcc_class, SUM(wri_tropical_tree_cover_extent__ha) AS wri_tropical_tree_cover_extent__ha FROM data {WHERE} AND wri_tropical_tree_cover__decile >= {decile} AND umd_global_land_cover__ipcc_class IS NOT NULL GROUP BY {location}, umd_global_land_cover__ipcc_class ORDER BY {location}, umd_global_land_cover__ipcc_class',
  treeCoverDensity:
    'SELECT {select_location}, wri_tropical_tree_cover__decile,  SUM(wri_tropical_tree_cover_extent__ha) AS wri_tropical_tree_cover_extent__ha FROM data {WHERE} AND wri_tropical_tree_cover__decile >= 0 GROUP BY {location}, wri_tropical_tree_cover__decile ORDER BY {location}, wri_tropical_tree_cover__decile',
  treeLossOTF:
    'SELECT umd_tree_cover_loss__year, SUM(area__ha) FROM data WHERE umd_tree_cover_loss__year >= {startYear} AND umd_tree_cover_loss__year <= {endYear} AND umd_tree_cover_density_{extentYear}__threshold >= {threshold} GROUP BY umd_tree_cover_loss__year&geostore_id={geostoreId}',
  treeLossOTFExtent:
    'SELECT SUM(area__ha) FROM data WHERE umd_tree_cover_density_2000__threshold >= {threshold}&geostore_id={geostoreId}',
};

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
  staticStatement,
  download,
}) => {
  let typeByLevel = type;

  if (staticStatement?.table) {
    return `/dataset/${staticStatement.table}/latest/${
      download ? 'download/csv' : 'query'
    }?sql=`;
  }

  if (type === 'country') {
    if (!adm1) typeByLevel = 'adm0';
    if (adm1) typeByLevel = 'adm1';
    if (
      adm2 ||
      (datasetType === 'daily' &&
        !['integrated_alerts', 'glad_alerts'].includes(dataset))
    )
      typeByLevel = 'adm2';
  }

  let datasetId = typeByLevel;

  try {
    typeByLevel = typeByGrouped[typeByLevel][grouped ? 'grouped' : 'default'];
  } catch (_) {
    // return null;
  }

  datasetId =
    DATASETS[
      `${dataset?.toUpperCase()}_${typeByLevel?.toUpperCase()}_${datasetType?.toUpperCase()}`
    ];

  const versionFromDictionary =
    DATASETS_VERSIONS[
      `${dataset?.toUpperCase()}_${typeByLevel?.toUpperCase()}_${datasetType?.toUpperCase()}`
    ];

  if (typeof datasetId === 'undefined') {
    // @TODO: Figure out why widgets are stale on loading, when not requesting info
    return null;
  }
  return `/dataset/${datasetId}/${
    version || versionFromDictionary || 'latest'
    // versionFromDictionary || version || 'latest'
  }/query?sql=`;
};

const getDownloadUrl = (pathname) => {
  try {
    const downloadUrl = new URL(
      `${window.location.origin}${PROXIES.DATA_API}${pathname}`
    );
    downloadUrl.pathname = downloadUrl.pathname.replace(
      'query',
      'download/csv'
    );
    return downloadUrl.toString();
  } catch {
    return null; // invalid url, front end should deal with this
  }
};

// build {select} from location params
const handleStaticLocStmt = (payload, download, staticStatement) => {
  if (staticStatement?.statement) {
    if (staticStatement.append) {
      return `${staticStatement.statement},${payload}`;
    }
    return staticStatement.statement;
  }
  return payload;
};

const getLocationSelect = ({
  type,
  adm0,
  adm1,
  adm2,
  grouped,
  cast,
  download,
  staticStatement,
}) => {
  if (type === 'wdpa')
    return handleStaticLocStmt(
      'wdpa_protected_area__id',
      download,
      staticStatement
    );
  if (['geostore', 'use'].includes(type))
    return handleStaticLocStmt('geostore__id', download, staticStatement);

  let locationString = `iso${adm1 ? ', adm1{castTemplate}' : ''}${
    adm2 ? ', adm2{castTemplate}' : ''
  }`;
  const castString = cast ? '::integer' : '';
  if (grouped) {
    locationString = `iso${adm0 ? ', adm1{castTemplate}' : ''}${
      adm1 ? ', adm2{castTemplate}' : ''
    }`;
  }

  return handleStaticLocStmt(
    locationString.replace(/{castTemplate}/g, castString),
    download,
    staticStatement
  );
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
export const getWeeksFilter = ({ weeks, latest, isFirst }) => {
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

  const weeksFilterString = weekFilters.reduce((acc, d, i) => {
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
  return `${isFirst ? '' : 'AND'} (${weeksFilterString})`;
};

//
// data fetches
//

// This is used by the treeLossTsc (pie chart version) widget (_tree-loss-drivers), which had its rollout paused.
export const getTreeCoverLossByDriverType = (params) => {
  const { download } = params;

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) return new Promise(() => {});

  const sqlQuery = SQL_QUERIES.treeCoverLossByDriver;

  const url = encodeURI(
    `${requestUrl}${sqlQuery}`.replace('{WHERE}', getWHEREQuery({ ...params }))
  );

  if (download) {
    return {
      name: 'tree_cover_loss_by_driver_type__ha',
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
      })),
    },
  }));
};

export const getLossNaturalForest = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
    version: 'v20240815',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.lossNaturalForest}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(
        '{WHERE}',
        getWHEREQuery({ ...params, dataset: 'annual', threshold: 0 })
      )
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `loss_natural_forest${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        area: d.umd_tree_cover_loss__ha,
        emissions: d.gfw_gross_emissions_co2e_all_gases__mg,
      })),
    },
  }));
};

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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        bound1: d.tsc_tree_cover_loss_drivers__driver,
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
        getLocationSelect({ ...params, cast: false })
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
  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        bound1: d.tsc_tree_cover_loss_drivers__driver,
        year: d.umd_tree_cover_loss__year,
        allGases: d.gfw_gross_emissions_co2e_all_gases__Mg,
        co2Only: d.gfw_gross_emissions_co2e_co2_only__Mg,
        nonCo2Gases: d.gfw_gross_emissions_co2e_non_co2__Mg,
      })),
    },
  }));
};

export const getEmissionsLossOTF = (params) => {
  const { download, threshold, geostoreId, startYear, endYear } = params || {};
  const { emissionsLossOTF } = SQL_QUERIES;

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${emissionsLossOTF}`
      .replace('{geostoreOrigin}', 'rw')
      .replace('{geostoreId}', geostoreId)
      .replace('{threshold}', threshold)
      .replace('{startYear}', startYear)
      .replace('{endYear}', endYear)
  );

  if (download) {
    return {
      name: 'Forest_related_GHG_emissions',
      url: getDownloadUrl(url),
    };
  }
  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        allGases: d.gfw_forest_carbon_gross_emissions__Mg_CO2e,
        loss: d.area__ha,
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) =>
    response?.data?.map((d) => ({
      removals:
        -d.gfw_gross_cumulative_aboveground_belowground_co2_removals__Mg || 0,
      emissions: d.gfw_gross_emissions_co2e_all_gases__Mg || 0,
      flux: d.gfw_net_flux_co2e__Mg || 0,
    }))
  );
};

export const getCarbonFluxOTF = (params) => {
  const { threshold, download, geostoreId } = params || {};
  const { carbonFluxOTF } = SQL_QUERIES;
  const url = encodeURI(
    `${getRequestUrl({
      ...params,
      dataset: 'annual',
      datasetType: 'summary',
      version: 'latest',
    })}${carbonFluxOTF}`
      .replace('{geostoreOrigin}', 'rw')
      .replace('{geostoreId}', geostoreId)
      .replace('{threshold}', threshold)
  );

  if (download) {
    return {
      name: 'Forest_related_net_carbon_flux',
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) =>
    response?.data?.map((d) => ({
      removals: -d.gfw_forest_carbon_gross_removals__Mg_CO2e || 0,
      emissions: d.gfw_forest_carbon_gross_emissions__Mg_CO2e || 0,
      flux: d.gfw_forest_carbon_net_flux__Mg_CO2e || 0,
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
        getLocationSelect({ ...params, grouped: true, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        area: d.umd_tree_cover_loss__ha,
        emissions: d.gfw_gross_emissions_co2e_all_gases__Mg,
      })),
    },
  }));
};

// tree cover loss from fires
export const getLossFires = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'change',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.lossFires}`
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss_from_fires_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        areaLoss: d.umd_tree_cover_loss__ha,
        areaLossFires: d.umd_tree_cover_loss_from_fires__ha,
        // emissions: d.gfw_gross_emissions_co2e_all_gases__Mg,
      })),
    },
  }));
};

export const getTreeLossOTF = async (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    adm0,
    geostore,
    startYear,
    endYear,
    extentYear,
    threshold,
  } = params || {};

  const geostoreId = geostore.id || adm0;
  const urlForList = '/dataset/umd_tree_cover_loss/latest/query';
  const urlForExtent = '/dataset/umd_tree_cover_density_2000/latest/query';
  const sqlLoss = `?sql=${SQL_QUERIES.treeLossOTF}`;
  const sqlExtent = `?sql=${SQL_QUERIES.treeLossOTFExtent}`;

  const urlLoss = encodeURI(
    `${urlForList + sqlLoss}`
      .replace('{geostoreId}', geostoreId)
      .replace('{startYear}', startYear)
      .replace('{endYear}', endYear)
      .replace('{threshold}', threshold)
      .replace('{extentYear}', extentYear)
  );
  const urlExtent = encodeURI(
    `${urlForExtent + sqlExtent}`
      .replace('{geostoreId}', geostoreId)
      .replace('{threshold}', threshold)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss_from_fires_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(urlLoss),
    };
  }

  const treeLoss = await dataRequest.get(urlLoss);
  const extent = await dataRequest.get(urlExtent);

  return {
    loss: treeLoss?.data?.map((d) => ({
      ...d,
      area: d.area__ha,
      year: d.umd_tree_cover_loss__year,
    })),
    extent: extent?.data?.[0]?.area__ha,
  };
};

export const getTreeCoverOTF = async (params) => {
  const { download, adm0, geostore, threshold } = params || {};

  const geostoreId = geostore.id || adm0;
  const urlBaseCover = '/dataset/umd_tree_cover_density_2000/latest/query';
  const urlBaseExtent = '/dataset/gfw_pixel_area/latest/query';
  const sqlCover = `?sql=${SQL_QUERIES.treeCoverOTF}`;
  const sqlExtent = `?sql=${SQL_QUERIES.treeCoverOTFExtent}`;

  const urlCover = encodeURI(
    `${urlBaseCover + sqlCover}`
      .replace('{threshold}', threshold)
      .replace('{geostoreId}', geostoreId)
  );

  const urlExtent = encodeURI(
    `${urlBaseExtent + sqlExtent}`.replace('{geostoreId}', geostoreId)
  );

  if (download) {
    return {
      name: `treecover_loss`,
      url: getDownloadUrl(urlCover),
    };
  }

  const treeCover = await dataRequest.get(urlCover);
  const extent = await dataRequest.get(urlExtent);

  return {
    totalArea: extent.data[0]?.area__ha,
    totalCover: treeCover.data[0]?.area__ha,
    cover: treeCover.data[0]?.area__ha,
    plantations: 0,
  };
};

export const getTreeCoverGainOTF = async (params) => {
  const { adm0, geostore } = params || {};
  const geostoreId = geostore.id || adm0;
  const urlBase = '/dataset/umd_tree_cover_gain/latest/query';
  const sql = `?sql=${SQL_QUERIES.treeCoverGainSimpleOTF}`;

  const url = encodeURI(`${urlBase + sql}`.replace('{geostoreId}', geostoreId));

  const response = await dataRequest.get(url);

  return {
    gain: response.data[0]?.area__ha,
    extent: params?.geostore?.areaHa || 0,
  };
};

export const getLossFiresOTF = (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    adm0,
    geostore,
    startYear,
    endYear,
    threshold,
  } = params || {};

  const geostoreId = geostore.id || adm0;
  const urlBase = '/dataset/umd_tree_cover_loss/v1.8/query/json?';
  const sql = `sql=${SQL_QUERIES.lossFiresOTF}`;

  const url = encodeURI(
    `${urlBase + sql}&geostore_id=${geostoreId}`
      .replace('{startYear}', startYear)
      .replace('{endYear}', endYear)
      .replace('{threshold}', threshold)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss_from_fires_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        areaLoss: d.umd_tree_cover_loss__ha,
        areaLossFires: d.umd_tree_cover_loss_from_fires__ha,
      })),
    },
  }));
};

export const getLossFiresGrouped = (params) => {
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
    `${requestUrl}${SQL_QUERIES.lossFires}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_loss_from_fires_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        year: d.umd_tree_cover_loss__year,
        areaLoss: d.umd_tree_cover_loss__ha,
        areaLossFires: d.umd_tree_cover_loss_from_fires__ha,
        // emissions: d.gfw_gross_emissions_co2e_all_gases__Mg,
      })),
    },
  }));
};

export const getTreeCoverGainByPlantationType = (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    startYear = 2000,
    endYear,
  } = params;

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) return new Promise(() => {});

  const sqlQuery = SQL_QUERIES.treeCoverGainByPlantationType;

  const baselineYearQuery = [];
  let startYearRef = parseInt(startYear, 10);

  while (startYearRef < endYear) {
    const nextYear = startYearRef + 5;
    baselineYearQuery.push(`${startYearRef}-${nextYear}`);
    startYearRef = nextYear;
  }

  const url = encodeURI(
    `${requestUrl}${sqlQuery}`
      .replace('{baselineYear}', `'${baselineYearQuery.join("', '")}'`)
      .replace('{WHERE}', getWHEREQuery({ ...params }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `tree_cover_gain_by_plantation_type_${startYear}-2020${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
      })),
    },
  }));
};

export const getTropicalExtent = (params) => {
  const { forestType, landCategory, download, extentYear } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    version: 'v20230502',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.tropicalExtent}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace(/{decile}/g, params?.decile)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory);
    return {
      name: `tropicaltreecover_extent_${extentYear}${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => {
    return {
      ...response,
      data: {
        data: response?.data?.map((d) => ({
          ...d,
          extent: d[`tropical_tree_cover_extent_${extentYear}_ha`],
          total_area: d.area__ha,
        })),
      },
    };
  });
};

export const getTropicalExtentGrouped = (params) => {
  const { forestType, landCategory, ifl, download, extentYear } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    version: 'v20230502',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.tropicalExtent}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace(/{decile}/g, params?.decile)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `tropical_treecover_extent_${extentYear}_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        extent: d[`tropical_tree_cover_extent_${extentYear}_ha`],
        total_area: d.area__ha,
      })),
    },
  }));
};

export const getNaturalForest = async (params) => {
  const { download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    version: 'v20240815',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.naturalForest}`
      .replace(/{location}/g, getLocationSelect({ ...params, cast: false }))
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace(
        '{WHERE}',
        getWHEREQuery({ ...params, dataset: 'annual', threshold: 0 })
      )
  );

  if (download) {
    return {
      name: `natural_forest_2020__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url);
};

export const getTreeCoverByLandCoverClass = (params) => {
  const { forestType, download, extentYear, landCategory, ifl } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    version: 'v20230502',
  });

  if (!requestUrl) return new Promise(() => {});

  const sqlQuery = SQL_QUERIES.treeCoverByLandCoverClass;

  const url = encodeURI(
    `${requestUrl}${sqlQuery}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params }))
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{decile}', params?.decile)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `tropical_treecover_extent_${extentYear}${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => response?.data);
};

// Net Change
export const getNetChange = async (params) => {
  const { forestType, landCategory, ifl, type, adm0, adm1, adm2, download } =
    params || {};

  const requestParams = qs.stringify(
    {
      type,
      adm0,
      adm1,
      adm2,
      download,
    },
    { arrayFormat: 'comma' }
  );

  const url = `/net-change/?${requestParams}`;

  /**
   * localhost:3000/api/datamart/net-change/?
   * &iso=MEX
   * &adm1=9
   * &adm2=3
   * &download=true
   */

  const response = await dataMartRequest.get(url);

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `net_tree_cover_change_from_height${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: `${window.location.origin}${PROXIES.DATA_API}${response.data?.url}`,
    };
  }

  return {
    data: {
      data: response.data,
    },
  };
};

export const getExtentNaturalForest = (params) => {
  const { forestType, landCategory, ifl, download } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    version: 'v20240815',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.extentNaturalForest}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace(
        '{WHERE}',
        getWHEREQuery({ ...params, dataset: 'annual', threshold: 0 })
      )
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `natural_forest_${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => {
    return {
      ...response,
      data: {
        data: response?.data?.map((d) => {
          return {
            ...d,
            extent:
              d.sbtn_natural_forests__class === 'Natural Forest'
                ? d.area__ha
                : 0,
            total_area: d.area__ha,
          };
        }),
      },
    };
  });
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => {
    return {
      ...response,
      data: {
        data: response?.data?.map((d) => ({
          ...d,
          extent: d[`umd_tree_cover_extent_${extentYear}__ha`],
          total_area: d.area__ha,
        })),
      },
    };
  });
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
        getLocationSelect({ ...params, grouped: true, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        extent: d[`umd_tree_cover_extent_${extentYear}__ha`],
        total_area: d.area__ha,
      })),
    },
  }));
};

// summed gain for single location
export const getGain = (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    startYear = 2000,
    endYear,
  } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const baselineYearQuery = [];
  let startYearRef = parseInt(startYear, 10);

  while (startYearRef < endYear) {
    const nextYear = startYearRef + 5;
    baselineYearQuery.push(`${startYearRef}-${nextYear}`);
    startYearRef = nextYear;
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.gain}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace('{baselineYear}', `'${baselineYearQuery.join("', '")}'`)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_gain_${startYear}-2020${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        gain: d.umd_tree_cover_gain__ha,
      })),
    },
  }));
};

// disaggregated gain for child of location
export const getGainGrouped = (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    startYear = 2000,
    endYear,
  } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const baselineYearQuery = [];
  let startYearRef = parseInt(startYear, 10);

  while (startYearRef < parseInt(endYear, 10)) {
    const nextYear = startYearRef + 5;
    baselineYearQuery.push(`${startYearRef}-${nextYear}`);
    startYearRef = nextYear;
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.gain}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace('{baselineYear}', `'${baselineYearQuery.join("', '")}'`)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `treecover_gain_${startYear}-2020_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        gain: d.umd_tree_cover_gain__ha,
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
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(
        /{intersection}/g,
        intersectionPolyname?.tableKey
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
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
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
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace(
        /{intersection}/g,
        intersectionPolyname?.tableKey
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

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
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
  const { alertsDaily, alertsWeekly, historicalIntegratedAlertsDaily } =
    SQL_QUERIES;

  const requestUrl = getRequestUrl({
    ...params,
    datasetType: frequency,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  let queryFrequency;
  if (frequency === 'daily') {
    queryFrequency = alertsDaily;
  } else {
    queryFrequency = alertsWeekly;
  }

  if (dataset === 'integrated_alerts') {
    queryFrequency = historicalIntegratedAlertsDaily;
  }

  const url = encodeURI(
    `${requestUrl}${queryFrequency}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
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
  return dataRequest.get(url).then((response) => ({
    data: {
      frequency,
      data: response?.data?.map((d) => ({
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
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

export const fetchIntegratedAlerts = (params) => {
  // Params
  const {
    startDate,
    endDate,
    download,
    geostoreId,
    alertSystem,
    forestType,
    landCategory,
    ifl,
    confirmedOnly = 0,
  } = params || {};

  let requestUrl;
  let query = SQL_QUERIES.integratedAlertsDaily;

  const datasetMapping = {
    all: 'gfw_integrated_alerts',
    glad_l: 'umd_glad_landsat_alerts',
    glad_s2: 'umd_glad_sentinel2_alerts',
    radd: 'wur_radd_alerts',
  };

  const dateString = datasetMapping[alertSystem].concat('__date');
  const confidenceString = datasetMapping[alertSystem].concat('__confidence');

  if (!download) {
    requestUrl = getRequestUrl({
      ...params,
      dataset: alertSystem === 'glad_l' ? 'glad' : 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'all') {
    query = SQL_QUERIES.integratedAlertsDailyDownload;
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'glad_l') {
    query = SQL_QUERIES.integratedAlertsDownloadGladL;
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'glad_s2') {
    query = SQL_QUERIES.integratedAlertsDownloadGladS;
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'radd') {
    query = SQL_QUERIES.integratedAlertsDownloadRadd;
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  let AND_OPERATION = '';

  if (download && confirmedOnly === 1) {
    AND_OPERATION = ' AND gfw_integrated_alerts__confidence != "nominal"';

    if (alertSystem === 'glad_l') {
      AND_OPERATION = ' AND umd_glad_landsat_alerts__confidence !== "nominal"';
    }

    if (alertSystem === 'glad_s2') {
      AND_OPERATION =
        ' AND umd_glad_sentinel2_alerts__confidence !== "nominal"';
    }

    if (alertSystem === 'radd') {
      AND_OPERATION = ' AND gfw_radd_alerts__confidence !== "nominal"';
    }
  }

  const url = encodeURI(
    `${requestUrl}${query}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(/{dateString}/g, dateString)
      .replace(/{confidenceString}/g, confidenceString)
      .replace(/{startDate}/g, startDate)
      .replace(/{endDate}/g, endDate)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
      .replace(/{AND_OPERATION}/, AND_OPERATION)
      .replace(/{geostoreOrigin}/g, 'gfw')
      .replace(/{geostoreId}/g, geostoreId)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    let fileName = 'deforestation_alerts';

    if (alertSystem === 'glad_l') {
      fileName = 'glad_l_alerts';
    }

    if (alertSystem === 'glad_s2') {
      fileName = 'glad_s_alerts';
    }

    if (alertSystem === 'radd') {
      fileName = 'radd_alerts';
    }

    return {
      name: `${fileName}${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__count`,
      url: getDownloadUrl(url),
    };
  }

  // Light initial Parsing
  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confidence: d[confidenceString],
        alerts: d.alert__count,
      })),
    },
  }));
};

export const getIntegratedAlertsRanked = (params) => {
  const {
    startDate,
    endDate,
    alertSystem,
    download,
    deforestationAlertsDataset,
    forestType,
    landCategory,
    ifl,
  } = params || {};
  let requestUrl;
  const query = SQL_QUERIES.integratedAlertsRanked;

  const datasetMapping = {
    all: 'gfw_integrated_alerts',
    glad_l: 'umd_glad_landsat_alerts',
    glad_s2: 'umd_glad_sentinel2_alerts',
    radd: 'wur_radd_alerts',
  };

  const alertTypeColumn =
    datasetMapping[deforestationAlertsDataset].concat('__date');

  if (!download) {
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'all') {
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'glad_l') {
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'glad_s2') {
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  if (download && alertSystem === 'radd') {
    requestUrl = getRequestUrl({
      ...params,
      dataset: 'integrated_alerts',
      datasetType: 'daily',
      // version override necessary here (no 'latest' defined)
      version: 'latest',
    });
  }

  const url = encodeURI(
    `${requestUrl}${query}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(/{alertTypeColumn}/g, alertTypeColumn)
      .replace(/{startDate}/g, startDate)
      .replace(/{endDate}/g, endDate)
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

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        count: d.alert__count,
        area_ha: d.alert_area__ha,
        alerts: d.alert__count,
      })),
    },
  }));
};

export const fetchGladAlertsDaily = (params) => {
  // Params
  const { startDate, endDate, download, deforestationAlertsDataset } =
    params || {};
  // Construct base url for fetch
  const baseUrl = `${getRequestUrl({
    ...params,
    dataset: 'glad_alerts',
    datasetType: 'daily',
    // version override necessary here (no 'latest' defined)
    version: 'latest',
    // Refernces the base SQL from the SQL_QUERIES object
  })}${SQL_QUERIES.integratedAlertsDaily}`;

  if (download) {
    // No download yet
  }

  const datasetMapping = {
    glad_l: 'umd_glad_landsat_alerts',
  };

  const dateString = `alert`.concat('__date');
  const confidenceString =
    datasetMapping[deforestationAlertsDataset].concat('__confidence');

  // Replace base url params and encode
  const url = encodeURI(
    baseUrl
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(/{dateString}/g, dateString)
      .replace(/{confidenceString}/g, confidenceString)
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
  );

  // Light initial Parsing
  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confidence: d[confidenceString],
        alerts: d.alert__count,
      })),
    },
  }));
};

export const fetchGladAlertsDailyRanked = (params) => {
  // Params
  const { startDate, endDate, download, deforestationAlertsDataset } =
    params || {};
  // Construct base url for fetch
  const baseUrl = `${getRequestUrl({
    ...params,
    dataset: 'glad_alerts',
    datasetType: 'daily',
    // version override necessary here (no 'latest' defined)
    version: 'latest',
    // Refernces the base SQL from the SQL_QUERIES object
  })}${SQL_QUERIES.integratedAlertsRanked}`;

  if (download) {
    // no download yet
  }

  const datasetMapping = {
    glad_l: 'umd_glad_landsat_alerts',
  };

  const dateString = `alert`.concat('__date');
  const confidenceString =
    datasetMapping[deforestationAlertsDataset].concat('__confidence');

  // Replace base url params and encode
  const url = encodeURI(
    baseUrl
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace(/{dateString}/g, dateString)
      .replace(/{confidenceString}/g, confidenceString)
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
  );

  // Light initial Parsing
  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confidence: d[confidenceString],
        alerts: d.alert__count,
      })),
    },
  }));
};

export const fetchGladAlertsSum = (params) => {
  const { forestType, landCategory, startDate, endDate, download, geostoreId } =
    params || {};
  const baseUrl = `${getRequestUrl({
    ...params,
    dataset: 'glad',
    datasetType: 'daily',
  })}${download ? SQL_QUERIES.gladDailyOTF : SQL_QUERIES.gladDailySum}`;

  if (download) {
    const url = encodeURI(
      baseUrl
        .replace('{startDate}', startDate)
        .replace('{endDate}', endDate)
        // @TODO Some forestType, LandCategory keys dont match
        .replace(
          '{WHERE}',
          getWHEREQuery({ forestType, landCategory, dataset: 'glad' })
        )
        .replace('{geostoreOrigin}', 'rw')
        .replace('{geostoreId}', geostoreId)
    );

    return {
      name: 'daily_glad_alerts__count',
      url: url.replace('query', 'download'),
    };
  }

  const url = encodeURI(
    baseUrl
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
  );

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confirmed: d.is__confirmed_alert,
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha,
      })),
    },
  }));
};

export const fetchGladAlertsSumOTF = (params) => {
  const { startDate, endDate, geostoreId } = params || {};

  const url = encodeURI(
    `${getRequestUrl({
      ...params,
      dataset: 'glad',
      datasetType: 'daily',
      download: false,
    })}${SQL_QUERIES.gladDailyOTF}`
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace('{geostoreOrigin}', 'rw')
      .replace('{geostoreId}', geostoreId)
  );
  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confirmed: d.umd_glad_landsat_alerts__confidence === 'high',
      })),
    },
  }));
};

// summed extent for single location
export const getTreeCoverDensity = (params) => {
  const requestUrl = getRequestUrl({
    ...params,
    dataset: 'annual',
    datasetType: 'summary',
    version: 'v20230502',
  });

  if (!requestUrl) {
    return Promise.reject();
  }

  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.treeCoverDensity}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect({ ...params }))
      .replace(
        '{WHERE}',
        getWHEREQuery({ ...params, dataset: 'treeCoverDensity' })
      )
  );

  return dataRequest.get(url).then((response) => response.data);
};

// Fallback for Latest Dates Alerts
const lastFriday = moment().day(-2).format('YYYY-MM-DD');

export const fetchGLADLatest = () => {
  const url = 'dataset/umd_glad_landsat_alerts/latest';

  return dataRequest
    .get(url)
    .then((response) => {
      const {
        metadata: {
          content_date_range: { end_date },
        },
      } = response.data;

      return {
        attributes: {
          updatedAt: end_date,
        },
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

export const fetchIntegratedLatest = () => {
  const url = 'dataset/gfw_integrated_alerts/latest';
  return dataRequest
    .get(url)
    .then((response) => {
      const date = response.metadata.last_update;

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

export const fetchBurnedArea = (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    dataset,
    firesThreshold: threshold,
  } = params || {};
  const url = encodeURI(
    `${getRequestUrl({
      ...params,
      dataset,
      datasetType: 'weekly',
    })}${SQL_QUERIES.burnedAreas}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset, threshold }))
  );
  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `modis_burned_area${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
      })),
    },
  }));
};

export const fetchBurnedAreaGrouped = (params) => {
  const {
    forestType,
    landCategory,
    ifl,
    download,
    firesThreshold: threshold,
  } = params || {};

  const requestUrl = getRequestUrl({
    ...params,
    datasetType: 'weekly',
    grouped: true,
  });

  if (!requestUrl) {
    return new Promise(() => {});
  }
  const whereStr =
    getWHEREQuery({ ...params, threshold, grouped: true }) || 'WHERE';
  const isFirst = whereStr === 'WHERE';
  const weeksFilterStr = getWeeksFilter({ ...params, isFirst });
  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.burnedAreaGrouped}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace('{WHERE}', whereStr)
      .replace(/{dateFilter}/g, weeksFilterStr)
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `modis_burned_area${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
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
  const whereStr =
    getWHEREQuery({ ...params, dataset: 'viirs', grouped: true }) || 'WHERE';
  const isFirst = whereStr === 'WHERE';
  const weeksFilterStr = getWeeksFilter({ ...params, isFirst });
  const url = encodeURI(
    `${requestUrl}${SQL_QUERIES.firesGrouped}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace('{WHERE}', whereStr)
      .replace(/{dateFilter}/g, weeksFilterStr)
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

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
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
  dataRequest
    .get('dataset/nasa_viirs_fire_alerts/latest/')
    .then(({ data }) => {
      const {
        metadata: {
          content_date_range: { end_date },
        },
      } = data;

      return {
        date: end_date,
      };
    })
    .catch(() => ({
      date: moment().utc().subtract('weeks', 2).format('YYYY-MM-DD'),
    }));

export const fetchMODISLatest = () =>
  dataRequest
    .get('dataset/umd_modis_burned_areas/latest')
    .then(({ data }) => {
      const dates =
        data && data?.metadata && data?.metadata?.content_date_range;
      const { end_date: date } = dates;
      return {
        date,
      };
    })
    .catch(() => ({
      date: moment().utc().subtract('weeks', 2).format('YYYY-MM-DD'),
    }));

export const fetchVIIRSAlertsSumOTF = (params) => {
  const { startDate, endDate, download, geostoreId } = params || {};
  const url = encodeURI(
    `${getRequestUrl({
      ...params,
    })}${SQL_QUERIES.firesDailySumOTF}`
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace('{geostoreId}', geostoreId)
  );

  if (download) {
    return {
      name: `fire_alerts`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confirmed: d.confidence__cat.includes('h'),
        count: d.alert__count,
        alerts: d.alert__count,
      })),
    },
  }));
};

export const fetchVIIRSAlertsSum = (params) => {
  const { startDate, endDate, dataset } = params || {};
  /*
   * Removing confidence parameter from VIIRS layer options
   * for Fire Alerts widget, we always fetch all alerts
   * and calculate the values directly on the selector.js
   */
  const paramKeys = Object.keys(params).filter(
    (param) => param !== 'confidence'
  );
  const paramsWithoutConfidenceAlert = {};

  paramKeys.forEach((parameter) => {
    paramsWithoutConfidenceAlert[parameter] = params[parameter];
  });

  const url = encodeURI(
    `${getRequestUrl({
      ...paramsWithoutConfidenceAlert,
      dataset,
      datasetType: 'daily',
    })}${SQL_QUERIES.firesDailySum}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...paramsWithoutConfidenceAlert, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(paramsWithoutConfidenceAlert))
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace(
        '{WHERE}',
        getWHEREQuery({ ...paramsWithoutConfidenceAlert, dataset: 'viirs' })
      )
  );

  return dataRequest.get(url).then((response) => ({
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        confirmed: d.confidence__cat.includes('h'),
        count: d.alert__count,
        alerts: d.alert__count,
      })),
    },
  }));
};

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
        getLocationSelect({ ...params, grouped: true, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
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
        getLocationSelect({ ...params, cast: false })
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

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: {
      data: response?.data?.map((d) => ({
        ...d,
        extent: d.umd_tree_cover_extent_2000__ha,
        biomass: d.whrc_aboveground_biomass_stock_2000__Mg,
        carbon: d.whrc_aboveground_co2_stock_2000__Mg,
      })),
    },
  }));
};

export const getSoilOrganicCarbon = (params) => {
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
    `${requestUrl}${SQL_QUERIES.organicSoilCarbon}`
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: false })
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `soil_organic_carbon_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => ({
    ...response,
    data: response.data.map((d) => ({
      iso: d.iso,
      soil_carbon__t: d.gfw_soil_carbon_stocks_2000__mg_c,
      soil_carbon_density__t_ha: d.gfw_soil_carbon_density__t_c_per_ha,
      totalbiomass: d.gfw_soil_carbon_stocks_2000__mg_c,
      biomassdensity: d.gfw_soil_carbon_density__t_c_per_ha,
      gfw_aboveground_carbon_stocks_2000__mg_c:
        d.gfw_aboveground_carbon_stocks_2000__t_c_per_ha,
      gfw_belowground_carbon_stocks_2000__mg_c:
        d.gfw_belowground_carbon_stocks_2000__t_c_per_ha,
    })),
  }));
};

// organic soil carbon grouped by location
export const getOrganicSoilCarbonGrouped = (params) => {
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
    `${requestUrl}${SQL_QUERIES.organicSoilCarbonGrouped}`
      .replace(/{location}/g, getLocationSelect({ ...params, grouped: true }))
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, grouped: true, cast: false })
      )
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'annual' }))
  );

  if (download) {
    const indicator = getIndicator(forestType, landCategory, ifl);
    return {
      name: `soil_organic_carbon_by_region${
        indicator ? `_in_${snakeCase(indicator.label)}` : ''
      }__ha`,
      url: getDownloadUrl(url),
    };
  }

  return dataRequest.get(url).then((response) => {
    return response?.data?.map((d) => ({
      ...d,
      biomass: d.gfw_soil_carbon_stocks_2000__Mg_C,
      biomassDensity: d.soil_carbon_density__t_ha,
    }));
  });
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
  const requestUrl = getRequestUrl({ ...params, datasetType: 'whitelist' });

  if (!requestUrl) {
    return new Promise(() => {});
  }

  const url = `${requestUrl}${SQL_QUERIES.getLocationPolynameWhitelist}`
    .replace(
      /{select_location}/g,
      getLocationSelect({ ...params, cast: false })
    )
    .replace(/{location}/g, getLocationSelect(params))
    .replace(
      '{polynames}',
      buildPolynameSelects(false, params.dataset || 'annual')
    )
    .replace('{WHERE}', getWHEREQuery(params));

  return dataRequest.get(url);
};
