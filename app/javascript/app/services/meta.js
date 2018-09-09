import request from 'utils/request';

const REQUEST_URL = `${process.env.GFW_API}/v1/gfw-metadata`;

export const getMeta = slug => {
  const url = `${REQUEST_URL}/${slug}`;
  return request.get(url);
};

export default {
  getMeta
};
