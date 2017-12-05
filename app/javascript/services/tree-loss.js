import axios from 'axios';
import datasets from './datasets.json';

const CONFIG = {
  treeLossDataset: 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea'
};

const APIURL = process.env.GFW_API_HOST_NEW_API;

const APIURLS = {
  getTreeLossByYear:
    '/query?sql=SELECT year, sum(area) as area, sum(emissions) as emissions FROM {dataset} WHERE {location} AND year >= {minYear} AND year <= {maxYear} AND thresh={threshold} GROUP BY year',
  getTreeLossByRegion:
    "/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso='{admin0}' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} GROUP BY adm1 ORDER BY value DESC"
};

export const getTreeLossByYear = (
  country,
  region,
  subRegion,
  indicator,
  years,
  threshold
) => {
  const url = `${APIURL}${APIURLS.getTreeLossByYear}`
    .replace('{dataset}', datasets[indicator].loss)
    .replace(
      '{location}',
      `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
        subRegion ? ` AND adm2 = ${subRegion}` : ''
      }`
    )
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshold}', threshold);
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
