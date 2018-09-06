import request from 'utils/request';

const QUERY = 'SELECT * from ';
const REQUEST_URL = `${process.env.CARTO_API}/sql?q=${QUERY}`;

export const getPTWProvider = date => {
  const url = REQUEST_URL.replace('{date}', date);
  return request.get(url);
};

export default {
  getPTWProvider
};
