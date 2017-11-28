import axios from 'axios';

const CONFIG = {
  coverDataset: '0ef4a861-930f-4f56-865d-89f5c0c6aef0',
  intactForestDataset: '1c4f89b1-4660-4246-894c-a88659cb4f71'
};

const APIURL = process.env.GFW_API_HOST_PROD;

const APIURLS = {
  getTotalCover:
    "/query?sql=select sum(area) as value FROM {dataset} WHERE iso='{admin0}' AND thresh={thresh} {groupBy}",
  getTotalIntactForest:
    "/query?sql=select sum(area) as value FROM {dataset} WHERE iso='{admin0}' {groupBy}",
  getListRegionsForest:
    "/query?sql=select sum(area) as value FROM {dataset} WHERE iso='{admin0}' AND thresh={thresh} GROUP BY adm1 ORDER BY value DESC"
};

export const getTotalCover = (admin0, admin1, canopy) => {
  const url = `${APIURL}${APIURLS.getTotalCover}`
    .replace('{dataset}', CONFIG.coverDataset)
    .replace('{admin0}', admin0)
    .replace('{thresh}', canopy)
    .replace(
      '{groupBy}',
      admin1 ? `AND adm1 = ${admin1} GROUP BY iso, adm1` : 'GROUP BY iso'
    );
  return axios.get(url);
};

export const getTotalIntactForest = (admin0, admin1) => {
  const url = `${APIURL}${APIURLS.getTotalIntactForest}`
    .replace('{dataset}', CONFIG.intactForestDataset)
    .replace('{admin0}', admin0)
    .replace(
      '{groupBy}',
      admin1 ? `AND adm1 = ${admin1} GROUP BY iso, adm1` : 'GROUP BY iso'
    );
  return axios.get(url);
};

export const getTotalCoverRegions = (admin0, canopy) => {
  const url = `${APIURL}${APIURLS.getListRegionsForest}`
    .replace('{dataset}', CONFIG.coverDataset)
    .replace('{admin0}', admin0)
    .replace('{thresh}', canopy);
  return axios.get(url);
};
