import lowerCase from 'lodash/lowerCase';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import compact from 'lodash/compact';
import moment from 'moment';
import { translateText } from 'utils/transifex';

import allOptions from '../options';

export const getForestTypes = ({
  forestTypes,
  settings,
  locationType,
  polynames,
  adm0
}) =>
  forestTypes
    .filter(o => {
      const isGlobal = locationType !== 'global' || o.global;
      const hasPolyname = isEmpty(polynames) || polynames.includes(o.value);
      return isGlobal && hasPolyname;
    })
    .map(f => ({
      ...f,
      label: f.label.includes('{iflYear}')
        ? f.label.replace('{iflYear}', settings.ifl)
        : f.label,
      metaKey:
        f.metaKey === 'primary_forest'
          ? `${lowerCase(adm0)}_${f.metaKey}${adm0 === 'IDN' ? 's' : ''}`
          : f.metaKey
    }));

export const getLandCategories = ({
  landCategories,
  locationType,
  polynames
}) =>
  landCategories.filter(o => {
    const isGlobal = locationType !== 'global' || o.global;
    const hasPolyname = isEmpty(polynames) || polynames.includes(o.value);
    return isGlobal && hasPolyname;
  });

export const getSettingsConfig = ({
  settingsConfig,
  settings,
  dataOptions,
  polynames
}) =>
  settingsConfig &&
  settingsConfig.map(o => {
    const { key, startKey, endKey, options, whitelist, locationType } = o || {};
    let mergedOptions =
      (dataOptions && dataOptions[key]) || options || allOptions[key];
    if (key === 'forestType') {
      mergedOptions =
        mergedOptions &&
        getForestTypes({
          forestTypes: mergedOptions,
          settings,
          polynames,
          locationType
        });
    } else if (key === 'landCategory') {
      mergedOptions =
        mergedOptions &&
        getLandCategories({
          landCategories: mergedOptions,
          polynames,
          locationType
        });
    }
    const parsedOptions = sortBy(mergedOptions, 'label');

    return {
      ...o,
      ...(parsedOptions && {
        options: parsedOptions.filter(
          opt => !whitelist || whitelist.includes(opt.value)
        ),
        value: parsedOptions.find(opt => opt.value === settings[key]),
        ...(startKey && {
          startOptions: parsedOptions.filter(
            opt => opt.value <= settings[endKey]
          ),
          startValue: parsedOptions.find(
            opt => opt.value === settings[startKey]
          )
        }),
        ...(endKey && {
          endOptions: parsedOptions.filter(
            opt => opt.value >= settings[startKey]
          ),
          endValue: parsedOptions.find(opt => opt.value === settings[endKey])
        })
      })
    };
  });

export const getOptionsSelected = options =>
  options &&
  options.reduce(
    (obj, option) => ({
      ...obj,
      [option.key]: option.options.find(o => o === option.value)
    }),
    {}
  );

export const getIndicator = (forestType, landCategory) => {
  if (!forestType && !landCategory) return null;
  let label = '';
  let value = '';
  if (forestType && landCategory) {
    label = `${forestType.label} in ${landCategory.label}`;
    value = `${forestType.value}__${landCategory.value}`;
  } else if (landCategory) {
    label = landCategory.label;
    value = landCategory.value;
  } else {
    label = forestType.label;
    value = forestType.value;
  }

  return {
    label,
    value
  };
};

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

export const getNonGlobalIndicator = ({
  forestType,
  landCategory,
  type,
  datasets
}) => {
  if (!datasets || type !== 'global') return null;

  const forestTypeCount = datasets[forestType && forestType.value];
  const landCategoryCount = datasets[landCategory && landCategory.value];

  const indicators = [];
  if (forestTypeCount) {
    indicators.push({
      label: forestType.label,
      count: forestTypeCount
    });
  }
  if (landCategoryCount) {
    indicators.push({
      label: landCategory.label,
      count: landCategoryCount
    });
  }

  return indicators;
};

export const getStatements = ({
  settings,
  type,
  dataType,
  landCategory,
  forestType,
  datasets
}) => {
  if (!settings) return null;
  const { extentYear, threshold } = settings;

  const indicators = getNonGlobalIndicator({
    forestType,
    landCategory,
    type,
    datasets
  });

  const indicatorStatements =
    indicators &&
    indicators.map(
      i =>
        (i
          ? translateText(
            '*{indicator} are available in {datasetsCount} countries only',
            {
              indicator: i.label.toLowerCase(),
              datasetsCount: i.count
            }
          )
          : null)
    );

  const statements = compact([
    extentYear
      ? translateText('{extentYear} tree cover extent', { extentYear })
      : null,
    threshold || threshold === 0
      ? translateText('>{threshold}% tree canopy', { threshold })
      : null,
    dataType === 'loss'
      ? translateText(
        'these estimates do not take tree cover gain into account'
      )
      : null,
    ...(indicatorStatements || [])
  ]);

  return statements;
};
