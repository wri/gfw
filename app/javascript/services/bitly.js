import request from 'utils/request';

import { BITLY_API_URL } from 'utils/constants';

const REQUEST_URL = `${BITLY_API_URL}/shorten?longUrl={url}&login={login}&apiKey={apiKey}`;
const USERNAME = process.env.BITLY_USER;
const API_KEY = process.env.BITLY_API_KEY;

export const getShortenUrl = longUrl => {
  const url = `${REQUEST_URL}`
    .replace('{url}', encodeURIComponent(longUrl))
    .replace('{login}', USERNAME)
    .replace('{apiKey}', API_KEY);
  return request.get(url);
};

export default getShortenUrl;
