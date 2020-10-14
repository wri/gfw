import { apiRequest } from 'utils/request';

const featureEnv = process.env.FEATURE_ENV;

export const getDatasetsProvider = () =>
  apiRequest.get(
    `/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
      featureEnv ? `,${featureEnv}` : ''
    }&${featureEnv === 'staging' ? `refresh${new Date()}` : ''}}`
  );
