import request from 'utils/request';

const REQUEST_URL = 'https://api.planet.com/basemaps/v1/mosaics';

export const fetchPlanetBasemaps = () =>
  request.get(`${REQUEST_URL}?api_key=${process.env.PLANET_API_KEY}`);
