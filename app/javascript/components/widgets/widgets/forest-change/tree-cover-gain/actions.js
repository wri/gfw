import axios from 'axios';

import { getGainGrouped } from 'services/forest-data';

export default ({ params }) =>
  axios.all([getGainGrouped(params)]).then(
    axios.spread(gainResponse => {
      const gainData = gainResponse.data.data;
      let mappedData = [];
      if (gainData && gainData.length) {
        mappedData = gainData.map(item => {
          const gain = item.gain || 0;
          const extent = item.value || 0;
          return {
            id: item.region,
            gain,
            extent,
            percentage: extent ? 100 * gain / extent : 0
          };
        });
      }
      return mappedData;
    })
  );
