import request, { apiRequest } from 'utils/request';
import qs from 'query-string';

export const submitContactForm = (formData) =>
  apiRequest.post('/form/contact-us', { ...formData });

export const submitNewsletterSubscription = (data) =>
  request({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'https://connect.wri.org/l/120942/2019-07-18/4d6vw2',
  });
