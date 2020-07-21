import { cartoRequest } from 'utils/request';
import { buildGadm36Id } from 'utils/format';

const SQL_QUERIES = {
  getCountryArea:
    "SELECT area_ha as value FROM gadm36_countries WHERE iso = '{adm0}'",
  getRegionArea:
    "SELECT area_ha as value FROM gadm36_adm1 WHERE iso = '{adm0}' AND gid_1 = '{adm1}'",
  getSubRegionArea:
    "SELECT area_ha as value FROM gadm36_adm2 WHERE iso = '{adm0}' AND gid_1 = '{adm1}' AND gid_2 = '{adm2}'"
};

export const getArea = ({ adm0, adm1, adm2 }) => {
  let url = '';
  if (adm0) {
    url = `/sql?q=${SQL_QUERIES.getSubRegionArea}`
      .replace('{adm0}', adm0)
      .replace('{adm1}', buildGadm36Id(adm0, adm1))
      .replace('{adm2}', buildGadm36Id(adm0, adm1, adm2));
  } else if (adm1) {
    url = `/sql?q=${SQL_QUERIES.getRegionArea}`
      .replace('{adm0}', adm0)
      .replace('{adm1}', buildGadm36Id(adm0, adm1));
  } else {
    url = `/sql?q=${SQL_QUERIES.getCountryArea}`.replace('{adm0}', adm0);
  }
  return cartoRequest.get(url);
};
