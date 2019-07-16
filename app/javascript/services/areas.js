import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/v2/area`;

export const getAreasProvider = token =>
  axios.get(REQUEST_URL, {
    headers: { Authorization: 'Bearer '.concat(token) }
  });

export const setAreasProvider = (token, body, method) => {
  const url =
    method === 'post' ? REQUEST_URL : REQUEST_URL.concat(`/${body.id}`);

  return axios({
    method,
    url,
    headers: { Authorization: 'Bearer '.concat(token) },
    data: body
  });
};

export default {
  getAreasProvider
};
