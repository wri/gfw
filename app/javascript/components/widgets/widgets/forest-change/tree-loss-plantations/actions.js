import { all, spread } from 'axios';
import { getLoss } from 'services/forest-data';

export default ({ params }) =>
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
