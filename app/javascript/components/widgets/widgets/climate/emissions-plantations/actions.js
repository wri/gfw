import { getAdmin } from 'services/forest-data';
import axios from 'axios';
import maxBy from 'lodash/maxBy';
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
        const maxByYearAdmin = adminData && maxBy(adminData, 'year');
        const maxByYearPlant = plantData && maxBy(plantData, 'year');

        const maxYear =
          adminData &&
          plantData &&
          maxByYearAdmin &&
          maxByYearPlant &&
          Math.max(maxByYearAdmin.year, maxByYearPlant.year);

        return { adminData, plantData, years: range(2013, maxYear + 1) };
      })
    );
