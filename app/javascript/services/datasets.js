import request from 'utils/request';

import { RESOURCE_WATCH_API } from 'utils/constants';

export const getDatasetsProvider = () =>
  request.get(
    `${
      RESOURCE_WATCH_API
    }/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
      process.env.FEATURE_ENV ? `,${process.env.FEATURE_ENV}` : ''
    }`
  );

export default getDatasetsProvider;
