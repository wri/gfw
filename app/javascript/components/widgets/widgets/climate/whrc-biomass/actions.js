import { getBiomassRanking } from 'services/climate';

export const getData = ({ params }) =>
  getBiomassRanking(params).then(res => res.data && res.data.rows);

export const getDataURL = params => [
  getBiomassRanking({ ...params, download: true })
];

export default getData;
