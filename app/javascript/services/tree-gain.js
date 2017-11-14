import axios from 'axios';

const CONFIG = {
  treeGain: 'fd3b3a12-121e-4189-96a3-d8c26b70952d'
};

const APIURL = process.env.GFW_API_AUTH;

const APIURLS = {
  'treeCoverGain': '/query?sql=select sum(area) as value from {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {region}',
  'treeCoverGainAllCountries': '/query?sql=select sum(area) as value from {dataset} WHERE year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue}',
  'treeCoverGainRegion': '/query?sql=select sum(area) as value from {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} GROUP by adm1 ORDER BY value DESC LIMIT 10',
};

export const getTotalCountriesTreeCoverGain = (years, thresh) => {
  const url = `${APIURL}${APIURLS.treeCoverGainAllCountries}`
    .replace('{dataset}', CONFIG.treeGain)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh);
  return axios.get(url);
};

export const getTreeCoverGain = (iso, years, thresh, region) => {
  const url = `${APIURL}${APIURLS.treeCoverGain}`
    .replace('{dataset}', CONFIG.treeGain)
    .replace('{iso}', iso)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh)
    .replace('{region}', region === 0 ? '' : `AND adm1 = ${region} GROUP BY iso, adm1`);
  return axios.get(url);
};

export const getTreeCoverGainRegion = (iso, years, thresh) => {
  const url = `${APIURL}${APIURLS.treeCoverGainRegion}`
    .replace('{dataset}', CONFIG.treeGain)
    .replace('{iso}', iso)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh);
  return axios.get(url);
};
