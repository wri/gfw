import request from 'utils/request';

import { RESOURCE_WATCH_API, FEATURE_ENV } from 'utils/constants';

export const getDatasetsProvider = () =>
  request.get(
    `${
      RESOURCE_WATCH_API
    }/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
      FEATURE_ENV ? `,${FEATURE_ENV}` : ''
    }`
  );

export default getDatasetsProvider;
