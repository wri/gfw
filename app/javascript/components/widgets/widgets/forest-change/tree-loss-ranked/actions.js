import { all, spread } from 'axios';
import { getLossGrouped, getExtentGrouped } from 'services/forest-data';

export default ({ params }) => {
  const { adm0, adm1, adm2, ...rest } = params || {};
  const parentLocation = {
    adm0: adm0 && !adm1 ? null : adm0,
    adm1: adm1 && !adm2 ? null : adm1,
    adm2: null
  };
  return all([
    getLossGrouped({ ...rest, ...parentLocation }),
    getExtentGrouped({ ...rest, ...parentLocation })
  ]).then(
    spread((lossResponse, extentResponse) => {
      const { data } = lossResponse.data;
      let mappedData = [];
      if (data && data.length) {
        mappedData = data.map(item => {
          const loss = item.area || 0;
          return {
            ...item,
            loss
          };
        });
      }
      return {
        loss: mappedData,
        extent: extentResponse.data.data
      };
    })
  );
};
