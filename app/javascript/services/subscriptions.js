import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}/subscriptions`;

export const postSubscription = data =>
  axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data,
    url: REQUEST_URL
  });
