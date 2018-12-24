import { getAdmin } from 'services/forest-data';
import axios from 'axios';

export default ({ params }) =>
  axios
    .all([
      getAdmin({ ...params }),
      getAdmin({ ...params, indicator: 'plantations' })
    ])
    .then(
      axios.spread((admin, plantations) => {
        const adminData = admin.data && admin.data.data;
        const plantData = plantations.data && plantations.data.data;

        const adminSum = adminData
          .filter(
            data => data.year >= params.startYear && data.year <= params.endYear
          )
          .reduce(
            (acc, next) => (next.emissions ? acc + next.emissions : acc),
            0
          );

        const plantSum = plantData
          .filter(
            data => data.year >= params.startYear && data.year <= params.endYear
          )
          .reduce(
            (acc, next) => (next.emissions ? acc + next.emissions : acc),
            0
          );

        return { adminSum, plantSum };
      })
    );
