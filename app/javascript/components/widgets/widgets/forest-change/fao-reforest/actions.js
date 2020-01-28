import { getFAOReforest } from 'services/forest-data';

export const getData = ({ params }) =>
  getFAOReforest(params).then(response => {
    const data = response.data.rows;
    const hasCountryData = (data.length && data.find(d => d.iso)) || null;
    return hasCountryData ? data : {};
  });

export const getDataURL = params => [
  getFAOReforest({ ...params, download: true })
];

export default getData;
