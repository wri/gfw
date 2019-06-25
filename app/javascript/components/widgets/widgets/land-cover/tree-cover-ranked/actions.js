import { fetchExtentRanked } from 'services/forest-data';

export const getData = ({ params }) =>
  fetchExtentRanked(params).then(response => {
    const { data } = response.data;
    let mappedData = [];
    if (data && data.length) {
      mappedData = data.map(item => {
        const area = item.total_area || 0;
        const extent = item.value || 0;
        return {
          id: item.iso,
          extent,
          area,
          percentage: extent ? 100 * extent / area : 0
        };
      });
    }
    return mappedData;
  });

export const getDataURL = params => [
  fetchExtentRanked({ ...params, download: true })
];

export default getData;
