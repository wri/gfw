import request from 'utils/request';

import { RESOURCE_WATCH_API } from 'utils/constants';

const REQUEST_URL = `${RESOURCE_WATCH_API}`;
const featureEnv = process.env.FEATURE_ENV;

export const getDatasetsProvider = () =>
  request.get(
    `${
      REQUEST_URL
    }/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
      featureEnv ? `,${featureEnv}` : ''
    }&${featureEnv === 'staging' ? `refresh${new Date()}` : ''}}`
  );
