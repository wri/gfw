import axios from 'axios';

const API_URL = process.env.BITLY_API_URL;
const USERNAME = process.env.BITLY_USER;
const API_KEY = process.env.BITLY_API_KEY;
const SHORTEN_URL = '/shorten?longUrl={url}&login={login}&apiKey={apiKey}';

export const getShortenUrl = longUrl => {
  const url = `${API_URL}${SHORTEN_URL}`
    .replace('{url}', encodeURIComponent(longUrl))
    .replace('{login}', USERNAME)
    .replace('{apiKey}', API_KEY);
  return axios.get(url);
};
