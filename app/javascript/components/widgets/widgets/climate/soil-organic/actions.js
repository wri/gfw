import { getSoilOrganicCarbon } from 'services/climate';

export default ({ params }) =>
  getSoilOrganicCarbon({ ...params }).then(res => res.data && res.data.rows);
