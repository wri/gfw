import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { getFAOEcoLive } from 'services/forest-data';

export const getData = ({ params }) =>
  getFAOEcoLive().then(response => {
    const { rows } = response.data;
    const { adm0, year } = params;
    const years = sortBy(
      uniq(
        rows
          .filter(
            d =>
              d.country === adm0 &&
              d.year !== 9999 &&
              d.usdrev !== null &&
              d.usdexp !== null &&
              d.usdexp !== ''
          )
          .map(d => ({ label: d.year, value: d.year }))
      )
    );
    const payload = {
      data: rows || {},
      options: {
        years
      },
      settings: {
        year: years.includes(year) ? year.value : years[0].value
      }
    };
    return payload;
  });

export const getDataURL = () => [getFAOEcoLive({ download: true })];

export default getData;
