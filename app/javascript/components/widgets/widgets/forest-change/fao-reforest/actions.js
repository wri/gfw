import { getFAOExtent } from 'services/forest-data';

export default ({ params }) =>
  getFAOExtent({ ...params }).then(response => {
    const data = response.data.rows;
    const hasCountryData = (data.length && data.find(d => d.iso)) || null;
    return hasCountryData ? data : {};
  });
