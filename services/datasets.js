import { rwRequest, dataRequest } from 'utils/request';

const environmentString = () => {
  const env = process.env.NEXT_PUBLIC_RW_FEATURE_ENV;
  let envString = 'production';
  if (env === 'preproduction') {
    envString += ',preproduction';
  }
  if (env === 'staging') {
    return 'staging';
  }
  return envString;
};

export const getDatasets = () =>
  rwRequest
    .get(
      `/dataset?application=gfw&includes=metadata,vocabulary,layer&published=true&page[size]=9999&env=${environmentString()}${
        environmentString() === 'staging'
          ? `&filterIncludesByEnv=true&refresh=${new Date()}`
          : ''
      }`
    )
    .then((res) => res?.data);

export const getDatasetMeta = () =>
  rwRequest
    .get('glad-alerts/latest/')
    .then((res) => res?.data)
    .then((data) => {
      const latestDate = data?.data[0]?.attributes?.date;
      return {
        'https://api.resourcewatch.org/glad-alerts/latest': latestDate,
      };
    })
    .catch(() => {
      return {
        'https://api.resourcewatch.org/glad-alerts/latest': '2021-11-12',
      };
    });

export const getDatasetQuery = ({ dataset, version = 'latest', sql, token }) =>
  dataRequest
    .get(`/dataset/${dataset}/${version}/query?sql=${sql}`, {
      cancelToken: token,
    })
    .then((res) => res?.data);

export const getDatasetGeostore = ({
  dataset,
  version = 'latest',
  geostoreId,
  token,
}) =>
  dataRequest
    .get(`/dataset/${dataset}/${version}/geostore/${geostoreId}`, {
      cancelToken: token,
    })
    .then((res) => res?.data);
