import axios from 'axios';

const CONFIG = {
  treeGain: 'fd3b3a12-121e-4189-96a3-d8c26b70952d'
};

const APIURL = process.env.GFW_API_AUTH;

const APIURLS = {
  treeCoverGain:
    "/query?sql=select sum(area) as value from {dataset} WHERE iso='{admin0}' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {groupBy}",
  treeCoverGainAllCountries:
    '/query?sql=select sum(area) as value from {dataset} WHERE year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue}',
  treeCoverGainRegion:
    "/query?sql=select sum(area) as value from {dataset} WHERE iso='{admin0}' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} GROUP by adm1 ORDER BY value DESC LIMIT 10"
};

export const getTreeCoverGain = (admin0, admin1, years, thresh) => {
  const url = `${APIURL}${APIURLS.treeCoverGain}`
    .replace('{dataset}', CONFIG.treeGain)
    .replace('{admin0}', admin0)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh)
    .replace(
      '{groupBy}',
      admin1 ? `AND adm1 = ${admin1} GROUP BY iso, adm1` : ''
    );
  return axios.get(url);
};

export const getTotalCountriesTreeCoverGain = (years, thresh) => {
  const url = `${APIURL}${APIURLS.treeCoverGainAllCountries}`
    .replace('{dataset}', CONFIG.treeGain)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh);
  return axios.get(url);
};

export const getTreeCoverGainRegion = (admin0, years, thresh) => {
  const url = `${APIURL}${APIURLS.treeCoverGainRegion}`
    .replace('{dataset}', CONFIG.treeGain)
    .replace('{admin0}', admin0)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh);
  return axios.get(url);
};
