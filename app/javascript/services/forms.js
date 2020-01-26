import { apiRequest } from 'axios';

export const submitContactForm = formData =>
  apiRequest.post('/form/contact-us', { ...formData });
