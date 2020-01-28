import { getLoss } from 'services/analysis-cached';
import { all, spread } from 'axios';

export const getData = ({ params }) =>
  all([
    getLoss({ ...params, forestType: 'plantations' }),
    getLoss({ ...params, forestType: '' })
  ]).then(
    spread((plantationsloss, gadmLoss) => {
      let data = {};
      const lossPlantations = plantationsloss.data && plantationsloss.data.data;
      const totalLoss = gadmLoss.data && gadmLoss.data.data;
      if (
        lossPlantations &&
        totalLoss &&
        lossPlantations.length &&
        totalLoss.length
      ) {
        data = {
          lossPlantations,
          totalLoss
        };
      }
      return data;
    })
  );

export const getDataURL = params => [
  getLoss({ ...params, forestType: 'plantations', download: true }),
  getLoss({ ...params, forestType: '', download: true })
];

export default getData;
