import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { getFAOEcoLive } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  getFAOEcoLive()
    .then(response => {
      const { rows } = response.data;
      const { country, year } = params;
      const years = sortBy(
        uniq(
          rows
            .filter(
              d =>
                d.country === country &&
                d.year !== 9999 &&
                d.usdrev !== null &&
                d.usdexp !== null &&
                d.usdexp !== ''
            )
            .map(d => d.year)
        )
      );
      const payload = {
        data: rows || {},
        config: {
          years
        },
        settings: {
          year: years.includes(year) ? year : years[0]
        },
        widget
      };
      dispatch(setWidgetData(payload));
    })
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
