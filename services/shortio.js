import axios from 'axios';

export const getShortenUrl = async ({ longUrl, path, title }) => {
  return axios.post('/api/shortio', {
    longUrl,
    title,
    path,
  });
};
