import axios from 'axios';
import { getLoss } from 'services/forest-data-old';

export default ({ params }) =>
  axios
    .all([
      getLoss({ ...params, forestType: 'plantations' }),
      getLoss({ ...params, forestType: '' })
    ])
    .then(
      axios.spread((plantationsloss, gadmLoss) => {
        let data = {};
        const lossPlantations =
          plantationsloss.data && plantationsloss.data.data;
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
