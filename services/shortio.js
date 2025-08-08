import request from 'utils/request';

export const getShortenUrl = (longUrl) =>
  request.post(
    'https://api.short.io/links',
    {
      allowDuplicates: false,
      originalURL: longUrl,
      ttl: 'TTL',
    },
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SHORTIO_API_KEY}`,
      },
    }
  );
