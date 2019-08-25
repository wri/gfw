import { getFAOEcoLive } from 'services/forest-data';

export default ({ params }) =>
  getFAOEcoLive(params.token).then(response => response.data.rows);
