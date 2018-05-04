import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_URL}/cache`;

const QUERIES = {
  keys: '/keys',
  add: '/add',
  get: '/{id}'
};

export const getKeys = () => {
  const url = REQUEST_URL + QUERIES.keys;
  return axios.get(url);
};

export const getKey = id => {
  const url = REQUEST_URL + QUERIES.get.replace('{id}', id);
  return axios.get(url);
};

export const addKey = (id, data) => {
  const url = REQUEST_URL + QUERIES.add;
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      id,
      data
    },
    url
  });
};
