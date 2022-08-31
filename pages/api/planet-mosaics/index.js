const axios = require('axios');

export default async function userHandler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    try {
      const mosaics = await axios.get(
        `https://api.planet.com/basemaps/v1/mosaics?api_key=${process.env.NEXT_PUBLIC_PLANET_API_KEY}&_page_size=1000`
      );
      res.send(mosaics?.data);
    } catch (err) {
      res.status(500).end('Error getting tile');
    }
  }
}
