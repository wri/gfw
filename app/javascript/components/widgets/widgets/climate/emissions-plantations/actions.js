import { getAdmin } from 'services/forest-data';
import axios from 'axios';
import maxBy from 'lodash/maxBy';
import range from 'lodash/range';

export const getData = ({ params }) =>
  axios
    .all([
      getAdmin({ ...params }),
      getAdmin({ ...params, indicator: 'plantations' })
    ])
    .then(
      axios.spread((admin, plantations) => {
        const adminData = admin.data && admin.data.data;
        const plantData = plantations.data && plantations.data.data;

        const maxAdmin = maxBy(adminData, 'year');
        const maxPlantations = maxBy(plantData, 'year');
        const maxYear =
          maxAdmin &&
          maxPlantations &&
          Math.max(maxAdmin.year, maxPlantations.year);

        return { adminData, plantData, years: range(2013, maxYear + 1) };
      })
    );

export const getDataURL = params => [
  getAdmin({ ...params, indicator: 'plantations', download: true })
];

export default getData;
