import request from 'utils/request';

const REQUEST_URL = 'https://api.planet.com/basemaps/v1/mosaics';

const ENV = process.env.NEXT_PUBLIC_FEATURE_ENV;
const PLANET_KEY =
  ENV === 'staging'
    ? process.env.NEXT_PUBLIC_STAGING_PLANET_API_KEY
    : process.env.NEXT_PUBLIC_PLANET_API_KEY;

export const fetchPlanetBasemaps = () =>
  request.get(`${REQUEST_URL}?api_key=${PLANET_KEY}&_page_size=1000`);
