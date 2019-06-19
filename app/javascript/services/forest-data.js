import request from 'utils/request';
import { getIndicator } from 'utils/strings';
import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const REQUEST_URL = `${process.env.GFW_API}/query/${DATASET}?sql=`;
const CARTO_REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const SQL_QUERIES = {
  extent:
    "SELECT SUM({extentYear}) as value, SUM(area_admin) as total_area FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  plantationsExtent:
    "SELECT SUM(area_poly_aoi) AS plantation_extent, {admin} AS region, {bound} AS label FROM data WHERE {location} AND thresh = 0 AND polyname = 'plantations' GROUP BY {type} ORDER BY plantation_extent DESC",
  multiRegionExtent:
    "SELECT {adm1} as region, SUM({extentYear}) as extent, SUM(area_admin) as total FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}' GROUP BY {adm1} ORDER BY {adm1}",
  rankedExtent:
    "SELECT polyname, SUM({extent_year}) as value, SUM(area_admin) as total_area, FROM data WHERE polyname='{polyname}' AND thresh={threshold} GROUP BY polyname, iso",
  gain:
    "SELECT {calc} as value FROM data WHERE {location} AND polyname = '{indicator}' AND thresh = 0",
  gainRanked:
    "SELECT {adm1} as region, SUM(area_gain) AS gain, SUM({extentYear}) as value FROM data WHERE {location} AND polyname = '{polyname}' AND thresh = 0 GROUP BY region",
  gainLocations:
    "SELECT {admin} as region, {calc} as gain FROM data WHERE {location} AND thresh = 0 AND polyname = '{indicator}' {grouping} ",
  loss:
    "SELECT bound1, polyname, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.emissions) as emissions FROM data WHERE {location} AND polyname = '{indicator}' AND thresh= {threshold} GROUP BY bound1, polyname, iso, nested(year_data.year)",
  locations:
    "SELECT {location} as region, {extentYear} as extent, {extent} as total FROM data WHERE iso = '{iso}' AND thresh = {threshold} AND polyname = '{indicator}' {grouping}",
  locationsLoss:
    "SELECT {select} AS region, year_data.year as year, SUM(year_data.area_loss) as area_loss, FROM data WHERE polyname = '{indicator}' AND iso = '{iso}' {adm1} AND thresh= {threshold} GROUP BY {group}, nested(year_data.year) ORDER BY {order}",
  lossRanked:
    "SELECT polyname, year_data.year as year, SUM(year_data.area_loss) as loss, SUM({extent_year}) as extent, FROM data WHERE polyname = '{polyname}' AND thresh = {threshold} GROUP BY polyname, iso, nested(year_data.year)",
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
    'SELECT iso, polyname FROM data WHERE polyname IN ({indicators}) GROUP BY iso, polyname ORDER BY polyname, iso',
  globalLandCover: 'SELECT * FROM global_land_cover_adm2 WHERE {location}',
  admin:
    "SELECT polyname, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.emissions) as emissions from {dataset} WHERE {location} AND polyname = '{indicator}' AND thresh= {threshold} GROUP BY {grouping}"
};

const getExtentYear = year =>
  (year === 2000 ? 'area_extent_2000' : 'area_extent');

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0 ? `iso = '${adm0}'` : '1 = 1'}${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

const getIndicatorsFromData = (types, categories) => {
  let indicators = '';
  const filterCats = categories.filter(c => !c.global);
  types.filter(t => !t.global).forEach((t, i) => {
    indicators = !i ? `'${t.value}'` : `${indicators}, '${t.value}'`;
    filterCats.filter(c => !c.global).forEach(c => {
      indicators = `${indicators}, '${c.value}'`;
      indicators = `${indicators}, '${t.value}__${c.value}'`;
    });
  });

  return indicators;
};

export const getLocations = ({
  adm0,
  adm1,
  forestType,
  landCategory,
  threshold,
  extentYear,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locations}`
    .replace('{location}', adm1 ? 'adm2' : 'adm1')
    .replace(
      '{extentYear}',
      `${!adm1 ? 'sum(' : ''}${getExtentYear(extentYear)}${!adm1 ? ')' : ''}`
    )
    .replace('{extent}', adm1 ? 'area_admin' : 'sum(area_admin)')
    .replace('{iso}', adm0)
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory))
    .replace('{grouping}', adm1 ? `AND adm1 = '${adm1}'` : 'GROUP BY adm1');
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getLocationsLoss = ({
  adm0,
  adm1,
  forestType,
  landCategory,
  threshold,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locationsLoss}`
    .replace('{select}', adm1 ? 'adm2' : 'adm1')
    .replace('{group}', adm1 ? 'adm2' : 'adm1')
    .replace('{order}', adm1 ? 'adm2' : 'adm1')
    .replace('{iso}', adm0)
    .replace('{adm1}', adm1 ? `AND adm1 = ${adm1}` : '')
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory));
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const fetchLossRanked = ({
  extentYear,
  forestType,
  landCategory,
  threshold,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.lossRanked}`
    .replace('{extent_year}', getExtentYear(extentYear))
    .replace('{polyname}', getIndicator(forestType, landCategory))
    .replace('{threshold}', threshold || 30);
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const fetchExtentRanked = ({
  extentYear,
  forestType,
  landCategory,
  threshold,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.rankedExtent}`
    .replace('{extent_year}', getExtentYear(extentYear))
    .replace('{polyname}', getIndicator(forestType, landCategory))
    .replace('{threshold}', threshold || 30);
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getExtent = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  threshold,
  extentYear,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.extent}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory))
    .replace('{extentYear}', getExtentYear(extentYear));
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getPlantationsExtent = ({
  adm0,
  adm1,
  adm2,
  threshold,
  type,
  groupByRegion
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.plantationsExtent}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{admin}', adm1 ? 'adm2' : 'adm1')
    .replace('{bound}', type)
    .replace(
      '{type}',
      groupByRegion ? `${adm1 ? 'adm2' : 'adm1'}, ${type}` : type
    );
  return request.get(url);
};

export const getMultiRegionExtent = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  threshold,
  extentYear,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.multiRegionExtent}`
    .replace(/{adm1}/g, adm1 ? 'adm2' : 'adm1')
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory))
    .replace('{extentYear}', getExtentYear(extentYear));
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getGain = ({ adm0, adm1, adm2, forestType, landCategory }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.gain}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{calc}', adm1 ? 'area_gain' : 'SUM(area_gain)')
    .replace('{indicator}', getIndicator(forestType, landCategory));
  return request.get(url);
};

export const getGainLocations = ({
  adm0,
  adm1,
  forestType,
  landCategory,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.gainLocations}`
    .replace('{location}', getLocationQuery(adm0, adm1))
    .replace('{admin}', adm1 ? 'adm2' : 'adm1')
    .replace('{calc}', adm1 ? 'area_gain' : 'SUM(area_gain)')
    .replace('{indicator}', getIndicator(forestType, landCategory))
    .replace('{grouping}', !adm1 ? 'GROUP BY adm1 ORDER BY adm1' : '');
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getLoss = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  threshold,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.loss}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{indicator}', getIndicator(forestType, landCategory));
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getFAO = ({ adm0 }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.fao}`.replace(
    '{location}',
    adm0 ? `country = '${adm0}'` : '1 = 1'
  );
  return request.get(url);
};

export const getFAOExtent = ({ period }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoExtent}`.replace(
    '{period}',
    period
  );
  return request.get(url);
};

export const getFAODeforest = ({ adm0 }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoDeforest}`.replace(
    '{location}',
    adm0 ? `WHERE fao.country = '${adm0}'` : ''
  );
  return request.get(url);
};
export const getFAODeforestRank = ({ period }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoDeforestRank}`.replace(
    '{year}',
    period
  );
  return request.get(url);
};

export const getFAOEcoLive = () => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoEcoLive}`;
  return request.get(url);
};

export const getGainRanked = ({
  adm0,
  adm1,
  adm2,
  forestType,
  landCategory,
  extentYear,
  download
}) => {
  let regionValue = 'iso';
  if (adm2) {
    regionValue = 'adm2';
  } else if (adm1) {
    regionValue = 'adm1';
  }

  const location = adm1
    ? `iso = '${adm0}' AND ${adm2 ? `adm1 = ${adm1} AND` : ''}`
    : '';

  const url = `${REQUEST_URL}${SQL_QUERIES.gainRanked}`
    .replace('{adm1}', regionValue)
    .replace('{location}', location)
    .replace('{extentYear}', getExtentYear(extentYear))
    .replace('{polyname}', getIndicator(forestType, landCategory));
  if (download) return url.replace('query', 'download');
  return request.get(url);
};

export const getNonGlobalDatasets = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.nonGlobalDatasets}`.replace(
    '{indicators}',
    getIndicatorsFromData(forestTypes, landCategories)
  );
  return request.get(url);
};

export const getGlobalLandCover = ({ adm0, adm1, adm2 }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.globalLandCover}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );
  return request.get(url);
};

export const getAdmin = ({
  adm0,
  adm1,
  adm2,
  threshold,
  indicator,
  download
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.admin}`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{threshold}', threshold || 30)
    .replace('{dataset}', DATASET)
    .replace('{indicator}', getIndicator(indicator))
    .replace(
      '{grouping}',
      indicator
        ? 'polyname, iso, nested(year_data.year)'
        : 'bound1, polyname, iso, nested(year_data.year)'
    );
  if (download) return url.replace('query', 'download');
  return request.get(url);
};
