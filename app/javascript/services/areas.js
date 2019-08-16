import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/v2/area`;

export const getAreasProvider = () =>
  axios.get(REQUEST_URL, {
    withCredentials: true
  });

export const getAreaProvider = id =>
  axios.get(`${REQUEST_URL}/${id}`, {
    withCredentials: true
  });

export const setAreasProvider = (body, method) => {
  const url =
    method === 'post' ? REQUEST_URL : REQUEST_URL.concat(`/${body.id}`);

  return axios({
    method,
    url,
    data: body,
    withCredentials: true
  });
};

export const deleteAreaProvider = id =>
  axios.delete(REQUEST_URL.concat(`/${id}`), {
    withCredentials: true
  });

export default {
  getAreasProvider
};
