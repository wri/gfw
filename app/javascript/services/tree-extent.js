import axios from 'axios';

const APIURL = process.env.GFW_API_HOST_NEW_API;

const APIURLS = {
  getExtent:
    "/query/8e272e2a-8874-4476-a339-66cabb464bd6?sql=SELECT SUM(area_extent) as value FROM data WHERE {location} AND thresh = {threshold} AND polyname = '{indicator}'"
};

export const getExtent = (
  country,
  region,
  subRegion,
  indicator,
  threshold = 30
) => {
  const url = `${APIURL}${APIURLS.getExtent}`
    .replace(
      '{location}',
      `iso = '${country}'${region ? ` AND adm1 = ${region}` : ''}${
        region ? ` AND adm2 = ${subRegion}` : ''
      }`
    )
    .replace('{threshold}', threshold)
    .replace('{indicator}', 'gadm28');
  return axios.get(url);
};
