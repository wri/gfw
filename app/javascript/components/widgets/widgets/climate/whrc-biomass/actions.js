import { getBiomassRanking } from 'services/climate';

export default ({ params }) =>
  getBiomassRanking({ ...params }).then(rows => rows.data && rows.data.rows);
