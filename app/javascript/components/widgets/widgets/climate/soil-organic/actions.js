import { getSoilOrganicCarbon } from 'services/climate';

export const getData = ({ params }) =>
  getSoilOrganicCarbon(params).then(res => res.data && res.data.rows);

export const getDataURL = params => [
  getSoilOrganicCarbon({ ...params, download: true })
];

export default getData;
