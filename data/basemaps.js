import sortBy from 'lodash/sortBy';
import { format, differenceInMonths } from 'date-fns';

// ES6 provision, replace the hyphens with slashes forces UTC to be calculated from timestamp
// instead of local time
// interesting article: https://codeofmatt.com/javascript-date-parsing-changes-in-es6/
const cleanPlanetDate = (dateStr) =>
  new Date(dateStr.substring(0, 10).replace(/-/g, '/'));

function sortPlanetBasemaps(items) {
  const init = items.map(({ name, first_acquired, last_acquired } = {}) => {
    const startDate = cleanPlanetDate(first_acquired);
    const endDate = cleanPlanetDate(last_acquired);
    const monthDiff = differenceInMonths(endDate, startDate);
    const period =
      monthDiff === 1
        ? `${format(startDate, 'MMM yyyy')}`
        : `${format(startDate, 'MMM yyyy')} - ${format(endDate, 'MMM yyyy')}`;

    return {
      name,
      period,
      date: startDate,
    };
  });

  return sortBy(init, (i) => {
    return new Date(i.date);
  }).reverse();
}

export default {
  planet: (data) => {
    const visual = data?.filter((bm) => bm.name.includes('visual'));
    const analytical = data?.filter((bm) => bm.name.includes('analytic'));

    const treatVisualAsAnalytical = !visual || visual.length === 0;

    const options = {
      visual: { label: 'Natural color', value: '', id: 'visual' },
      analytical: {
        label: 'False color (NIR)',
        value: 'cir',
        id: 'analytical',
      },
    };

    if (treatVisualAsAnalytical) {
      options.visual.value = 'rgb';
    }

    const sortAnalytical = sortPlanetBasemaps(analytical);
    const sortVisual = sortPlanetBasemaps(visual);

    return {
      analytical: sortAnalytical,
      visual: treatVisualAsAnalytical ? sortAnalytical : sortVisual,
      options,
    };
  },
};
