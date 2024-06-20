import { serialize } from 'cookie';

export default async function cookieHandler(req, res) {
  const { method } = req;
  if (method === 'POST') {
    const body = JSON.parse(req.body);
    if (body.token) {
      res.setHeader(
        'Set-Cookie',
        serialize('gfw-token', body.token, {
          path: '/',
          httpOnly: true,
          maxAge: 31536000, // expires in 1 year
        })
      );
      res.status(200).end('ok');
    }
  } else if (method === 'GET') {
    res.setHeader(
      'Set-Cookie',
      serialize('gfw-token', '', { path: '/', maxAge: -1 })
    );
    res.status(200).end('ok');
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(405).end('');
}
