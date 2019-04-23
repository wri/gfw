import { getExtentGrouped } from 'services/forest-data';

export default ({ params }) =>
  getExtentGrouped(params).then(response => {
    const { data } = response.data;
    let mappedData = {};
    if (data && data.length) {
      let groupKey = 'adm0';
      if (params.adm0) groupKey = 'adm1';
      if (params.adm1) groupKey = 'adm2';

      mappedData = data.map(d => ({
        id: d[groupKey],
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
