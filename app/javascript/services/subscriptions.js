import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/subscriptions`;

export const postSubscription = (data, token) =>
  axios({
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data,
    url: REQUEST_URL
  });
