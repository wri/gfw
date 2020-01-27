import { getExtentGrouped } from 'services/analysis-cached';

export default ({ params }) => {
  const { adm0, adm1, adm2, ...rest } = params || {};
  const parentLocation = {
    adm0: adm0 && !adm1 ? null : adm0,
    adm1: adm1 && !adm2 ? null : adm1,
    adm2: null
  };
  return getExtentGrouped({ ...rest, ...parentLocation }).then(response => {
    const { data } = response.data;
    let mappedData = [];
    if (data && data.length) {
      mappedData = data.map(item => {
        const area = item.total_area || 0;
        const extent = item.extent || 0;
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
};
