import request from 'utils/request';
import { buildGadm36Id } from 'utils/format';

const REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const SQL_QUERIES = {
  getCountryArea:
    "SELECT area_ha as value FROM gadm36_countries WHERE iso = '{adm0}'",
  getRegionArea:
    "SELECT area_ha as value FROM gadm36_adm1 WHERE iso = '{adm0}' AND gid_1 = '{adm1}'",
  getSubRegionArea:
    "SELECT area_ha as value FROM gadm36_adm2 WHERE iso = '{adm0}' AND gid_1 = '{adm1}' AND gid_2 = '{adm2}'"
};

export const getArea = ({ country, region, subRegion }) => {
  let url = '';
  if (subRegion) {
    url = `${REQUEST_URL}${SQL_QUERIES.getSubRegionArea}`
      .replace('{adm0}', country)
      .replace('{adm1}', buildGadm36Id(country, region))
      .replace('{adm2}', buildGadm36Id(country, region, subRegion));
  } else if (region) {
    url = `${REQUEST_URL}${SQL_QUERIES.getRegionArea}`
      .replace('{adm0}', country)
      .replace('{adm1}', buildGadm36Id(country, region));
  } else {
    url = `${REQUEST_URL}${SQL_QUERIES.getCountryArea}`.replace(
      '{adm0}',
      country
    );
  }
  return request.get(url);
};
