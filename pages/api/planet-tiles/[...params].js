const axios = require('axios');

export default async function userHandler(req, res) {
  const {
    query: { params, proc },
    method,
  } = req;
  if (method === 'GET') {
    const PLANET_KEY = process.env.NEXT_PUBLIC_PLANET_API_KEY;
    try {
      const tile = await axios.get(
        `https://tiles.planet.com/basemaps/v1/planet-tiles/${params?.join(
          '/'
        )}.png?proc=${proc || ''}&api_key=${PLANET_KEY}`,
        {
          responseType: 'arraybuffer',
        }
      );
      res.setHeader('content-type', 'image/png');
      res.send(tile?.data);
    } catch (err) {
      res.status(500).end('Error getting tile');
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
