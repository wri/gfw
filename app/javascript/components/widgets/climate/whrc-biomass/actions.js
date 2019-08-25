import { getBiomassRanking } from 'services/climate';

export default ({ params }) =>
  getBiomassRanking({ ...params }).then(res => res.data && res.data.rows);
