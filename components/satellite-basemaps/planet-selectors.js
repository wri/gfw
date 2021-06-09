import { createSelector } from 'reselect';

import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format, differenceInMonths } from 'date-fns';

const selectPlanetBasemaps = (state) => {
  // const activeType = state?.map?.settings?.basemap?.color;
  // This can be either rgb<string> hex value <#xxx> or nir<string>
  // const imageType = activeType !== 'cir' ? 'visual' : 'analytic';
  const imageType = 'analytic';
  const planetBasemaps = state.planet?.data;
  // XXX: Filter planet basemaps based on active image type
  return planetBasemaps?.filter((bm) => bm.name.includes(imageType));
};

// ES6 provision, replace the hyphens with slashes forces UTC to be calculated from timestamp
// instead of local time
// interesting article: https://codeofmatt.com/javascript-date-parsing-changes-in-es6/
const cleanPlanetDate = (dateStr) =>
  new Date(dateStr.substring(0, 10).replace(/-/g, '/'));


export const getPlanetBasemaps = createSelector(
  [selectPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    return sortBy(
      planetBasemaps.map(({ name, first_acquired, last_acquired } = {}) => {
        const startDate = cleanPlanetDate(first_acquired);
        const endDate = cleanPlanetDate(last_acquired);
        const monthDiff = differenceInMonths(endDate, startDate);
        const year = format(startDate, 'yyyy');

        const period =
          monthDiff === 1
            ? `${format(startDate, 'MMM yyyy')}`
            : `${format(startDate, 'MMM yyyy')} - ${format(
                endDate,
                'MMM yyyy'
              )}`;

        const label =
          monthDiff === 1
            ? `${format(startDate, 'MMM')}`
            : `${format(startDate, 'MMM')} - ${format(
                endDate,
                'MMM'
              )}`;

        return {
          name,
          period,
          label,
          year,
          sortOrder: Date(startDate),
        };
      }),
      'sortOrder'
    ).reverse();
  }
);
