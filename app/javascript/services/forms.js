import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;

export const submitContactForm = formData =>
  axios.post(`${REQUEST_URL}/form/contact-us`, { ...formData });
