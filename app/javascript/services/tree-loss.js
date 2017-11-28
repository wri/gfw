import axios from 'axios';

const CONFIG = {
  treeLossDataset: 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea'
};

const APIURL = process.env.GFW_API_HOST_PROD;

const APIURLS = {
  getTreeLossByYear:
    "/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso='{admin0}' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {groupBy}",
  getTreeLossByRegion:
    "/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso='{admin0}' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} GROUP BY adm1 ORDER BY value DESC"
};

export const getTreeLossByYear = (admin0, admin1, years, thresh) => {
  const url = `${APIURL}${APIURLS.getTreeLossByYear}`
    .replace('{dataset}', CONFIG.treeLossDataset)
    .replace('{admin0}', admin0)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh)
    .replace(
      '{groupBy}',
      admin1 ? `AND adm1 = ${admin1} GROUP BY year, adm1` : 'GROUP BY year'
    );
  return axios.get(url);
};

export const getTreeLossByRegion = (admin0, years, thresh) => {
  const url = `${APIURL}${APIURLS.getTreeLossByRegion}`
    .replace('{dataset}', CONFIG.treeLossDataset)
    .replace('{admin0}', admin0)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh);
  return axios.get(url);
};
