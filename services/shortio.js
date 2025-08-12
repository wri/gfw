import axios from 'axios';

export const getShortenUrl = async (longUrl) => {
  return axios.post('/api/shortio', {
    longUrl,
  });
};
