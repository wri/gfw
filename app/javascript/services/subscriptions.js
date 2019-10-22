import axios from 'axios';
import qs from 'query-string';

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

export const postNewsletterSubscription = (data, url) =>
  axios({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url
  });
