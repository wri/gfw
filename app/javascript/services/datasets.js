import request from 'utils/request';

const REQUEST_URL = `${process.env.RESOURCE_WATCH_API}`;
// const featureEnv = process.env.FEATURE_ENV;

// TODO: Production layers
// export const getDatasetsProvider = () =>
//   request.get(
//     `${
//       REQUEST_URL
//     }/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&env=production${
//       featureEnv ? `,${featureEnv}` : ''
//     }`
//   );

export const getDatasetsProvider = () =>
  request.get(
    `${
      REQUEST_URL
    }/dataset?app=gfw&includes=vocabulary,metadata,layer&env=staging&page[size]=1000&hash=352`
  );
