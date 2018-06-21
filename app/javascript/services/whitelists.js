import request from 'utils/request';

const DATASET = process.env.COUNTRIES_PAGE_DATASET;
const REQUEST_URL = `${process.env.GFW_API}/query/${DATASET}?sql=`;

const SQL_QUERIES = {
  getCountryWhitelist:
    "SELECT polyname, SUM(area_extent_2000) as total_extent_2000, SUM(area_extent) as total_extent_2010, SUM(area_gain) as total_gain, SUM(year_data.area_loss) as total_loss FROM data WHERE thresh = 0 AND iso = '{iso}' GROUP BY polyname",
  getRegionWhitelist:
    'SELECT polyname, SUM(area_extent_2000) as total_extent_2000, SUM(area_extent) as total_extent_2010, SUM(area_gain) as total_gain, SUM(year_data.area_loss) as total_loss FROM data WHERE thresh = 0 AND {location} GROUP BY polyname'
};

const getLocationQuery = (adm0, adm1, adm2) =>
  `iso = '${adm0}'${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const getCountryWhitelistProvider = adm0 => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getCountryWhitelist}`.replace(
    '{iso}',
    adm0
  );
  return request.get(url);
};

export const getRegionWhitelistProvider = (adm0, adm1, adm2) => {
  const url = `${REQUEST_URL}${SQL_QUERIES.getRegionWhitelist}`.replace(
    '{location}',
    getLocationQuery(adm0, adm1, adm2)
  );
  return request.get(url);
};
