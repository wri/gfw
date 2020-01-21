import axios from 'axios';
import qs from 'query-string';

export const postNewsletterSubscription = data =>
  axios({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'https://connect.wri.org/l/120942/2019-07-18/4d6vw2'
  });
