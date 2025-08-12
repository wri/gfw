import axios from 'axios';
import { addMonths } from 'date-fns';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }

  const { longUrl } = req.body;

  try {
    const monthFromNow = addMonths(new Date(), 1);
    const response = await axios.post(
      'https://api.short.io/links',
      {
        allowDuplicates: false,
        originalURL: longUrl,
        ttl: monthFromNow.toISOString(),
        domain: 'gfw.global',
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
