import axios from 'axios';

const CONFIG = {
  treeLossDataset: 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea'
};

const APIURL = process.env.GFW_API_HOST_PROD;

const APIURLS = {
  'getTreeLossByYear': '/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {region}',
  'getTreeLossByRegion': '/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} GROUP BY adm1 ORDER BY value DESC LIMIT 10',
};

export const getTreeLossByYear = (iso, region, years, thresh) => {
  const url = `${APIURL}${APIURLS.getTreeLossByYear}`
    .replace('{dataset}', CONFIG.treeLossDataset)
    .replace('{iso}', iso)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh)
    .replace('{region}', region === 0 ? 'GROUP BY year' : `AND adm1 = ${region} GROUP BY year, adm1`);
  return axios.get(url);
};

export const getTreeLossByRegion = (iso, years, thresh) => {
  const url = `${APIURL}${APIURLS.getTreeLossByRegion}`
    .replace('{dataset}', CONFIG.treeLossDataset)
    .replace('{iso}', iso)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh)
  return axios.get(url);
};
