import request from 'utils/request';

export const getShortenUrl = longUrl => request.post('https://api-ssl.bitly.com/v4/shorten', {
  long_url: longUrl
},
{
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${process.env.BITLY_TOKEN}`
  }
});
