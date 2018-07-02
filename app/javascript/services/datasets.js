import request from 'utils/request';

const REQUEST_URL = `${process.env.RESOURCE_WATCH_API}`;

export const getDatasetsProvider = () =>
  request.get(
    `${
      REQUEST_URL
    }/dataset?application=rw&includes=metadata,vocabulary,layer,timeline&page[size]=5`
  );
