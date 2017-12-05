import axios from 'axios';
import datasets from './datasets.json';

const APIURL = process.env.GFW_API_HOST_NEW_API;

const APIURLS = {
  getExtent:
    '/query?sql=SELECT area as value FROM {dataset} WHERE {location} AND thresh = {threshold}'
};

export const getExtent = (country, region, subRegion, indicator, threshold) => {
  const url = `${APIURL}${APIURLS.getExtent}`
    .replace('{dataset}', datasets[indicator].extent)
    .replace(
      '{location}',
      `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
        subRegion ? ` AND adm2 = ${subRegion}` : ''
      }`
    )
    .replace('{threshold}', threshold);
  return axios.get(url);
};
