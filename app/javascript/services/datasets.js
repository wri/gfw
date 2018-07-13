import request from 'utils/request';

const REQUEST_URL = `${process.env.RESOURCE_WATCH_API}`;

export const getDatasetsProvider = () =>
  request.get(
    `${
      REQUEST_URL
    }/dataset/3f3da1e2-0891-4fed-9460-a53c01ba211a?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999`
  );
