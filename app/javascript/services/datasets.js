import request from 'utils/request';

import { RESOURCE_WATCH_API } from 'utils/constants';

const featureEnv = process.env.FEATURE_ENV;

export const getDatasetsProvider = () =>
  request.get(
    `${
      RESOURCE_WATCH_API
    }/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
      featureEnv ? `,${featureEnv}` : ''
    }&${featureEnv === 'staging' ? `refresh${new Date()}` : ''}}`
  );

export default getDatasetsProvider;
