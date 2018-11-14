import axios from 'axios';
import { getLoss } from 'services/forest-data';

export default ({ params }) =>
  axios
    .all([
      getLoss({ ...params, forestType: 'plantations' }),
      getLoss({ ...params, forestType: '' })
    ])
    .then(
      axios.spread((plantationsloss, gadmLoss) => {
        let data = {};
        const loss = plantationsloss.data && plantationsloss.data.data;
        const totalLoss = gadmLoss.data && gadmLoss.data.data;
        if (loss.length && totalLoss.length) {
          data = {
            loss,
            totalLoss
          };
        }
        return data;
      })
    );
