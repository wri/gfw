import axios from 'axios';

const CONFIG = {
  login: 'simbiotica',
  apiKey: 'R_33ced8db36b545829eefeb644f4c3d19'
};

const APIURL = 'https://api-ssl.bitly.com/v3';

const APIURLS = {
  getShortenUrl: '/shorten?longUrl={url}&login={login}&apiKey={apiKey}'
};

export const getShortenUrl = longUrl => {
  const url = `${APIURL}${APIURLS.getShortenUrl}`
    .replace('{url}', encodeURIComponent(longUrl))
    .replace('{login}', CONFIG.login)
    .replace('{apiKey}', CONFIG.apiKey);
  return axios.get(url);
};
