import { rwRequest, dataRequest } from 'utils/request';

export const getDatasets = () =>
  rwRequest
    .get(
      `/dataset?application=gfw&includes=metadata,vocabulary,layer&env=production&published=true&page[size]=9999`
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
