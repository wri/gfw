import request from 'utils/request';

const REQUEST_URL = '/api/planet-mosaics/';

export const fetchPlanetBasemaps = () => request.get(REQUEST_URL);
