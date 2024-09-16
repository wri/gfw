import request, { apiRequest } from 'utils/request';
import qs from 'query-string';

export const submitContactForm = (formData) =>
  apiRequest.post('/v1/form/contact-us', { ...formData });

export const submitNewsletterSubscription = (data) =>
  request({
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'https://ortto.wri.org/custom-forms/gfw/',
  });
