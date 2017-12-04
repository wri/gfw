import axios from 'axios';

const APIURL = 'https://wri-01.carto.com/api/v2';

const APIURLS = {
  getCountryArea:
    "/sql?q=SELECT land as value FROM umd_nat_staging WHERE iso = '{adm0}' AND year = 2001 and thresh = 30",
  getRegionArea:
    "/sql?q=SELECT land as value FROM umd_subnat_staging WHERE iso = '{adm0}' AND id1 = {adm1} AND year = 2001 and thresh = 30",
  getSubRegionArea:
    "/sql?q=SELECT ROUND(ST_AREA(the_geom::geography) * 0.0001) as value FROM gadm28_adm2 WHERE iso = '{adm0}' AND id_1 = {adm1} AND id_2 = {adm2}"
};

export const fetchArea = (country, region, subRegion) => {
  let url = '';
  if (subRegion) {
    url = `${APIURL}${APIURLS.getSubRegionArea}`
      .replace('{adm0}', country)
      .replace('{adm1}', region)
      .replace('{adm2}', subRegion);
  } else if (region) {
    url = `${APIURL}${APIURLS.getRegionArea}`
      .replace('{adm0}', country)
      .replace('{adm1}', region);
  } else {
    url = `${APIURL}${APIURLS.getCountryArea}`.replace('{adm0}', country);
  }
  return axios.get(url);
};
