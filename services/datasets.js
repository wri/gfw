import { rwRequest, dataRequest } from 'utils/request';

const featureEnv = process.env.NEXT_PUBLIC_FEATURE_ENV;

export const getDatasets = () =>
  rwRequest
    .get(
      `/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
        featureEnv ? `,${featureEnv}` : ''
      }&${featureEnv === 'staging' ? `refresh${new Date()}` : ''}}`
    )
    .then((res) => res?.data);

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
