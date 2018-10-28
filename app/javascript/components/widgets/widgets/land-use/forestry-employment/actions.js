import { getFAOEcoLive } from 'services/forest-data';

export default () => getFAOEcoLive().then(response => response.data.rows);
