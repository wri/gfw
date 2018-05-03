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
