import { getAdmin } from 'services/forest-data';
import axios from 'axios';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import range from 'lodash/range';

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

        const minYear = Math.max(
          minBy(adminData, 'year').year,
          minBy(adminData, 'year').year
        );
        const maxYear = Math.max(
          maxBy(adminData, 'year').year,
          maxBy(adminData, 'year').year
        );

        return { adminData, plantData, years: range(minYear, maxYear) };
      })
    );
