import axios from 'axios';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405);
  }
  // path is an optional custom path for the short link
  // e.g. { longUrl: 'https://gfw.global', path: 'custom-path' }
  // will create the short link gfw.global/custom-path
  // this is temporary since we need the same short link to exist in both short.io and bitly
  // until we fully migrate to short.io
  const { longUrl, path, title } = req.body;

  try {
    const response = await axios.post(
      'https://api.short.io/links',
      {
        allowDuplicates: false,
        originalURL: longUrl,
        domain: 'gfw.global',
        ...(path && { path }),
        ...(title && { title }),
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
