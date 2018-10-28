import { getLocations, fetchExtentRanked } from 'services/forest-data';

export default ({ params }) => {
  const fetchFunc =
    !params.type || params.type === 'global'
      ? fetchExtentRanked(params)
      : getLocations(params);
  return fetchFunc.then(response => {
    const { data } = response.data;
    let mappedData = {};
    if (data && data.length) {
      mappedData = data.map(d => ({
        id: d.region,
        extent: d.extent || 0,
        percentage: d.extent ? d.extent / d.total * 100 : 0
      }));
      if (!params.type || params.type === 'global') {
        mappedData = data.map(d => ({
          id: d.iso,
          extent: d.value || 0,
          percentage: d.value ? d.value / d.total_area * 100 : 0
        }));
      }
    }
    return mappedData;
  });
};
