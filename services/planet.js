import request from 'utils/request';
import { PROXIES } from 'utils/proxies';

export const fetchPlanetBasemaps = () => request.get(`${PROXIES.PLANET_API}/`);
