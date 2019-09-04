import moment from 'moment';

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

export const getPolynameDatasets = ({
  optionsSelected,
  settings,
  polynames
}) => {
  const iflYear =
    optionsSelected &&
    optionsSelected.ifl &&
    optionsSelected.ifl.find(opt => opt.value === settings.ifl);

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
