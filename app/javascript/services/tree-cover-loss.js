import axios from 'axios';

const CONFIG = {
  coverLossDataset: 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea'
};

const APIURL = process.env.GFW_API_HOST_PROD;

const APIURLS = {
  'getCoverLossByYear': '/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {region}',
};

export const getCoverLossByYear = (iso, region, years, thresh) => {
  const url = `${APIURL}${APIURLS.getCoverLossByYear}`
    .replace('{dataset}', CONFIG.coverLossDataset)
    .replace('{iso}', iso)
    .replace('{minYear}', years.minYear)
    .replace('{maxYear}', years.maxYear)
    .replace('{threshValue}', thresh)
    .replace('{region}', region === 0 ? 'GROUP BY year' : `AND adm1 = ${region} GROUP BY year, adm1`);
  return axios.get(url);
};
