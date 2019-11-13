import axios from 'axios';
import qs from 'query-string';

export const postNewsletterSubscription = (data, url) =>
  axios({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url
  });
