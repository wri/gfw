import axios from 'axios';
import qs from 'query-string';

const REQUEST_URL = `${process.env.GFW_API}/subscriptions`;

export const postSubscription = data =>
  axios({
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    withCredentials: true,
    data,
    url: REQUEST_URL
  });

export const postNewsletterSubscription = (data, url) =>
  axios({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url
  });
