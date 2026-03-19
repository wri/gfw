import { serialize } from 'cookie';

export default async function cookieHandler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const body = JSON.parse(req.body);
    const cookies = [];

    if (body.token) {
      cookies.push(
        serialize('gfw-token', body.token, {
          path: '/',
          httpOnly: true,
          maxAge: 31536000, // expires in 1 year
        })
      );
    }

    if (body.jwt) {
      cookies.push(
        serialize('gfw-jwt', body.jwt, {
          path: '/',
          httpOnly: true,
          maxAge: 31536000, // expires in 1 year
        })
      );
    }

    if (cookies.length) {
      res.setHeader('Set-Cookie', cookies);
      res.status(200).end('ok');
      return;
    }

    res.status(400).end('Missing token');
    return;
  }

  if (method === 'GET') {
    res.setHeader('Set-Cookie', [
      serialize('gfw-token', '', { path: '/', maxAge: -1 }),
      serialize('gfw-jwt', '', { path: '/', maxAge: -1 }),
    ]);
    res.status(200).end('ok');
    return;
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
