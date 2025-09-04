import axios from 'axios';
import { addMonths } from 'date-fns';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  // path is an optional custom path for the short link
  // e.g. { longUrl: 'https://gfw.global', path: 'custom-path' }
  // will create the short link gfw.global/custom-path
  // this is temporary since we need the same short link to exist in both short.io and bitly
  // until we fully migrate to short.io
  const { longUrl, path } = req.body;

  try {
    const monthFromNow = addMonths(new Date(), 1);
    const response = await axios.post(
      'https://api.short.io/links',
      {
        allowDuplicates: false,
        originalURL: longUrl,
        ttl: monthFromNow.toISOString(),
        domain: 'gfw.global',
        ...(path && { path }),
      },
      {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `${process.env.NEXT_PUBLIC_SHORTIO_API_KEY}`,
        },
      }
    );

    return res.status(201).send(response.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
