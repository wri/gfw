import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { fetchTraseContexts, fetchTraseLocationData } from 'services/trase';

export default ({ params }) =>
  fetchTraseContexts().then(response => {
    const context = response.data.data.filter(d => d.countryName === 'BRAZIL' && d.commodityName === 'COFFEE');

    return fetchTraseLocationData(context[0].id, context[0].worldMap.countryColumnId)
      .then(data => {
        return {
          context: context[0],
          data: data.data.data
        };
      });
  });
