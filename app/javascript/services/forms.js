import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API_HOST_PROD}`;

export const submitContactForm = formData =>
  axios.post(`${REQUEST_URL}/form/contact-us`, formData);
