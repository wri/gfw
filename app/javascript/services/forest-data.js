import axios from 'axios';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}/query/${DATASET}?sql=`;
const CARTO_REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  extent:
    "SELECT SUM({extentYear}) as value, SUM(area_gadm28) as total_area FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'",
  plantationsExtent:
    "SELECT SUM({extentYear}) AS plantation_extent FROM data WHERE {location} AND thresh = {threshold} AND polyname = 'plantations' GROUP BY {type} ORDER BY plantation_extent DESC",
  multiRegionExtent:
    "SELECT {region} as region, SUM({extentYear}) as extent, SUM(area_gadm28) as total FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}' GROUP BY {region} ORDER BY {region}",
  gain:
    "SELECT {calc} as value FROM data WHERE {location} AND polyname = '{indicator}' AND thresh = {threshold}",
  gainExtent:
    "SELECT {region} as region, SUM(area_gain) AS gain, SUM({extentYear}) AS extent FROM data WHERE {location} AND polyname = '{polyname}' AND extent <> -9999 AND thresh = 0 GROUP BY region",
  gainLocations:
    "SELECT {admin} as region, {calc} as gain, FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}' {grouping} ",
  loss:
    "SELECT polyname, year_data.year as year, SUM(year_data.area_loss) as area, SUM(year_data.emissions) as emissions FROM data WHERE polyname = '{indicator}' AND {location} AND thresh= {threshold} GROUP BY polyname, iso, nested(year_data.year)",
  locations:
    "SELECT {location} as region, {extentYear} as extent, {extent} as total FROM data WHERE iso = '{iso}' AND thresh = {threshold} AND polyname = '{indicator}' {grouping}",
  locationsLoss:
    "SELECT {select} AS region, year_data.year as year, SUM(year_data.area_loss) as area_loss, FROM data WHERE polyname = '{indicator}' AND iso = '{iso}' {region} AND thresh= {threshold} GROUP BY {group}, nested(year_data.year) ORDER BY {order}",
  fao:
    "SELECT fao.iso, fao.name, forest_planted, forest_primary, forest_regenerated, fao.forest_primary, fao.extent, a.land as area_ha FROM gfw2_countries as fao INNER JOIN umd_nat_staging as a ON fao.iso = a.iso WHERE fao.forest_primary is not null AND fao.iso = '{country}' AND a.year = 2001 AND a.thresh = 30",
  faoExtent:
    'SELECT country AS iso, name, year, reforest AS rate, forest*1000 AS extent FROM table_1_forest_area_and_characteristics as fao WHERE fao.year = {period} AND reforest > 0 ORDER BY rate DESC'
};

const getExtentYear = year =>
  (year === 2000 ? 'area_extent_2000' : 'area_extent');

const getLocationQuery = (country, region, subRegion) =>
  `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
    subRegion ? ` AND adm2 = ${subRegion}` : ''
  }`;

export const getLocations = ({
  country,
  region,
  indicator,
  threshold,
  extentYear
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locations}`
    .replace('{location}', region ? 'adm2' : 'adm1')
    .replace(
      '{extentYear}',
      `${!region ? 'sum(' : ''}${getExtentYear(extentYear)}${
        !region ? ')' : ''
      }`
    )
    .replace('{extent}', region ? 'area_gadm28' : 'sum(area_gadm28)')
    .replace('{iso}', country)
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator)
    .replace('{grouping}', region ? `AND adm1 = '${region}'` : 'GROUP BY adm1');
  return axios.get(url);
};

export const getLocationsLoss = ({ country, region, indicator, threshold }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.locationsLoss}`
    .replace('{select}', region ? 'adm2' : 'adm1')
    .replace('{group}', region ? 'adm2' : 'adm1')
    .replace('{order}', region ? 'adm2' : 'adm1')
    .replace('{iso}', country)
    .replace('{region}', region ? `AND adm1 = ${region} AS region` : '')
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator);
  return axios.get(url);
};

export const getExtent = ({
  country,
  region,
  subRegion,
  indicator,
  threshold,
  extentYear
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.extent}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator)
    .replace('{extentYear}', getExtentYear(extentYear));
  return axios.get(url);
};

export const getPlantationsExtent = ({
  country,
  region,
  subRegion,
  threshold,
  extentYear,
  type
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.plantationsExtent}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{type}', `${region ? 'adm2' : 'adm1'}, ${type}`)
    .replace('{extentYear}', getExtentYear(extentYear));
  return axios.get(url);
};

export const getMultiRegionExtent = ({
  country,
  region,
  subRegion,
  indicator,
  threshold,
  extentYear
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.multiRegionExtent}`
    .replace(/{region}/g, region ? 'adm2' : 'adm1')
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator)
    .replace('{extentYear}', getExtentYear(extentYear));
  return axios.get(url);
};

export const getGain = ({
  country,
  region,
  subRegion,
  indicator,
  threshold
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.gain}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{calc}', region ? 'area_gain' : 'SUM(area_gain)')
    .replace('{indicator}', indicator);
  return axios.get(url);
};

export const getGainLocations = ({ country, region, indicator, threshold }) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.gainLocations}`
    .replace('{location}', getLocationQuery(country, region))
    .replace('{threshold}', threshold)
    .replace('{admin}', region ? 'adm2' : 'adm1')
    .replace('{calc}', region ? 'area_gain' : 'SUM(area_gain)')
    .replace('{indicator}', indicator)
    .replace('{grouping}', !region ? 'GROUP BY adm1 ORDER BY adm1' : '');
  return axios.get(url);
};

export const getLoss = ({
  country,
  region,
  subRegion,
  indicator,
  threshold
}) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.loss}`
    .replace('{location}', getLocationQuery(country, region, subRegion))
    .replace('{threshold}', threshold)
    .replace('{indicator}', indicator);
  return axios.get(url);
};

export const getFAO = ({ country }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.fao}`.replace(
    '{country}',
    country
  );
  return axios.get(url);
};

export const getFAOExtent = ({ period }) => {
  const url = `${CARTO_REQUEST_URL}${SQL_QUERIES.faoExtent}`.replace(
    '{period}',
    period
  );
  return axios.get(url);
};

export const getGainExtent = ({
  country,
  region,
  subRegion,
  indicator,
  extentYear
}) => {
  let regionValue = 'iso';
  if (subRegion) {
    regionValue = 'adm2';
  } else if (region) {
    regionValue = 'adm1';
  }

  const location = region
    ? `iso = '${country}' ${subRegion ? `AND adm1 = ${region}` : ''}`
    : '1 = 1';

  const url = `${REQUEST_URL}${SQL_QUERIES.gainExtent}`
    .replace('{region}', regionValue)
    .replace('{location}', location)
    .replace('{extentYear}', getExtentYear(extentYear))
    .replace('{polyname}', indicator);
  return axios.get(url);
};
