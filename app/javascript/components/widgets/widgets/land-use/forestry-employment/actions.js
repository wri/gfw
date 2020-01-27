import { getFAOEcoLive } from 'services/forest-data';

export const getData = () =>
  getFAOEcoLive().then(response => response.data.rows);

export const getDataURL = () => [getFAOEcoLive({ download: true })];

export default getData;
