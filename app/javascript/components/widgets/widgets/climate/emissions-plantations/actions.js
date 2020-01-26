import { getLoss } from 'services/forest-data';
import { all, spread } from 'axios';
import maxBy from 'lodash/maxBy';
import range from 'lodash/range';

export default ({ params }) =>
  all([
    getLoss(params),
    getLoss({ ...params, forestType: 'plantations' })
  ]).then(
    spread((admin, plantations) => {
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
