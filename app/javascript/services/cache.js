import axios from 'axios';

const REQUEST_URL = '/cache';

const QUERIES = {
  add: '/add',
  get: '/{id}'
};

export const getKey = id => {
  const url = REQUEST_URL + QUERIES.get.replace('{id}', id);
  return axios.get(url);
};

export const addKey = (id, data, expire) => {
  const url = REQUEST_URL + QUERIES.add;
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      id,
      data,
      expire
    },
    url
  });
};
