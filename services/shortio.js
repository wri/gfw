import axios from 'axios';

export const getShortenUrl = async ({ longUrl, path }) => {
  return axios.post('/api/shortio', {
    longUrl,
    path,
  });
};
