import axios from 'axios';

const CONFIG = {
  coverDataset: '0ef4a861-930f-4f56-865d-89f5c0c6aef0',
  intactForestDataset: '1c4f89b1-4660-4246-894c-a88659cb4f71'
};

const APIURL = process.env.GFW_API_HOST_PROD;

const APIURLS = {
  'getTotalCover': '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' AND thresh=30 {region}',
  'getTotalIntactForest': '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' {region}'
};

export const getTotalCover = (iso, region) => {
  const url = `${APIURL}${APIURLS.getTotalCover}`
    .replace('{dataset}', CONFIG.coverDataset)
    .replace('{iso}', iso)
    .replace('{region}', region === 0 ? 'GROUP BY iso' : `AND adm1 = ${region} GROUP BY iso, adm1`);
  return axios.get(url);
};

export const getTotalIntactForest = (iso, region) => {
  const url = `${APIURL}${APIURLS.getTotalIntactForest}`
    .replace('{dataset}', CONFIG.intactForestDataset)
    .replace('{iso}', iso)
    .replace('{region}', region === 0 ? 'GROUP BY iso' : `AND adm1 = ${region} GROUP BY iso, adm1`);
  return axios.get(url);
};
