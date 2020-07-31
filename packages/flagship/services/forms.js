import { apiRequest } from 'utils/request';

export const submitContactForm = formData =>
  apiRequest.post('/form/contact-us', { ...formData });
