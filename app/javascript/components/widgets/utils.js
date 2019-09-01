import moment from 'moment';
import lowerCase from 'lodash/lowerCase';

import forestTypes from 'data/forest-types.json';
import landCategories from 'data/land-categories.json';

export const getWidgetDatasets = ({
  datasets,
  extentYear,
  startYear,
  endYear,
  year,
  weeks,
  latestDate,
  threshold
}) =>
  datasets &&
  datasets.map(d => ({
    ...d,
    opacity: 1,
    visibility: true,
    ...(!d.boundary && {
      layers:
        extentYear && !Array.isArray(d.layers)
          ? [d.layers[extentYear]]
          : d.layers,
      ...(((startYear && endYear) || year) && {
        timelineParams: {
          startDate: `${startYear || year}-01-01`,
          endDate: `${endYear || year}-12-31`,
          trimEndDate: `${endYear || year}-12-31`
        }
      }),
      ...(weeks && {
        timelineParams: {
          startDate: moment(latestDate || null)
            .subtract(weeks, 'weeks')
            .format('YYYY-MM-DD'),
          endDate: moment(latestDate || null).format('YYYY-MM-DD'),
          trimEndDate: moment(latestDate || null).format('YYYY-MM-DD')
        }
      }),
      ...(threshold && {
        params: {
          thresh: threshold,
          visibility: true
        }
      })
    })
  }));

export const getPolynameDatasets = ({ options, settings, polynames }) => {
  const iflYear =
    options &&
    options.ifl &&
    options.ifl.find(opt => opt.value === settings.ifl);

  return (
    polynames &&
    polynames.flatMap(
      polyname =>
        polyname.datasets &&
        polyname.datasets.map(d => ({
          opacity: 0.7,
          visibility: 1,
          ...d,
          sqlParams: iflYear && {
            where: {
              class: iflYear.layerValue
            }
          }
        }))
    )
  );
};

export const getForestTypes = ({ settings, locationType, polynames, adm0 }) => forestTypes.filter(o => {
  const isGlobal = locationType !== 'global' || o.global;
  const hasPolyname = !polynames || polynames.includes(o.value);
  return isGlobal && hasPolyname;
}).map(f => ({
  ...f,
  label: f.label.includes('{iflYear}')
    ? f.label.replace('{iflYear}', settings.ifl)
    : f.label,
  metaKey: f.metaKey === 'primary_forest'
    ? `${lowerCase(adm0)}_${f.metaKey}${
      adm0 === 'IDN' ? 's' : ''
    }`
    : f.metaKey
}));

export const getLandCategories = ({ locationType, polynames }) => landCategories.filter(o => {
  const isGlobal = locationType !== 'global' || o.global;
  const hasPolyname = !polynames || polynames.includes(o.value);
  return isGlobal && hasPolyname;
});
