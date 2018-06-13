import request from 'utils/request';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  getCountryArea:
    "SELECT land as value FROM umd_nat_staging WHERE iso = '{adm0}' AND year = 2001 and thresh = 30",
  getRegionArea:
    "SELECT area_ha as value FROM gadm36_adm1 WHERE iso = '{adm0}' AND id_1 = {adm1}",
  getSubRegionArea:
    "SELECT ROUND(ST_AREA(the_geom::geography) * 0.0001) as value FROM gadm36_adm2 WHERE iso = '{adm0}' AND id_1 = {adm1} AND id_2 = {adm2}"
};

export const getArea = ({ country, region, subRegion }) => {
  let url = '';
  if (subRegion) {
    url = `${REQUEST_URL}${SQL_QUERIES.getSubRegionArea}`
      .replace('{adm0}', country)
      .replace('{adm1}', region)
      .replace('{adm2}', subRegion);
  } else if (region) {
    url = `${REQUEST_URL}${SQL_QUERIES.getRegionArea}`
      .replace('{adm0}', country)
      .replace('{adm1}', region);
  } else {
    url = `${REQUEST_URL}${SQL_QUERIES.getCountryArea}`.replace(
      '{adm0}',
      country
    );
  }
  return request.get(url);
};
