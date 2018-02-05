import axios from 'axios';

const REQUEST_URL = `${
  process.env.BITLY_API_URL
}/shorten?longUrl={url}&login={login}&apiKey={apiKey}`;
const USERNAME = process.env.BITLY_USER;
const API_KEY = process.env.BITLY_API_KEY;

export const getShortenUrl = longUrl => {
  const url = `${REQUEST_URL}`
    .replace('{url}', encodeURIComponent(longUrl))
    .replace('{login}', USERNAME)
    .replace('{apiKey}', API_KEY);
  return axios.get(url);
};
