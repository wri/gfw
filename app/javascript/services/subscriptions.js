import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/subscriptions`;

export const postSubscription = (data, method) =>
  axios({
    method,
    headers: {
      'content-type': 'application/json'
    },
    withCredentials: true,
    data: JSON.stringify(data),
    url: method === 'post' ? REQUEST_URL : REQUEST_URL.concat(`/${data.id}`)
  });

export const getSubscriptions = () =>
  axios.get(REQUEST_URL, {
    withCredentials: true
  });

export const deleteSubscription = id =>
  axios.delete(REQUEST_URL.concat(`/${id}`), {
    withCredentials: true
  });
