import lowerCase from 'lodash/lowerCase';
import sortBy from 'lodash/sortBy';
import compact from 'lodash/compact';
import moment from 'moment';
import { translateText } from 'utils/lang';
import { encodeQueryParams } from 'utils/url';

import allOptions from '../options';

export const getForestTypes = ({
  forestTypes,
  settings,
  polynamesWhitelist,
  adm0,
}) =>
  forestTypes
    .filter((o) => {
      const isGlobal = !polynamesWhitelist && o.global;
      const hasPolyname =
        isGlobal ||
        (polynamesWhitelist &&
          polynamesWhitelist.includes(
            o.tableKey || o.tableKeys[settings.dataset || 'annual']
          ));
      return isGlobal || hasPolyname;
    })
    .map((f) => ({
      ...f,
      label: f.label.includes('{iflYear}')
        ? f.label.replace('{iflYear}', settings.ifl || 2000)
        : f.label,
      metaKey:
        f.metaKey === 'primary_forest'
          ? `${lowerCase(adm0)}_${f.metaKey}${adm0 === 'IDN' ? 's' : ''}`
          : f.metaKey,
    }));

export const getLandCategories = ({
  landCategories,
  polynamesWhitelist,
  settings,
}) =>
  landCategories.filter((o) => {
    const isGlobal = !polynamesWhitelist && o.global;
    const hasPolyname =
      isGlobal ||
      (polynamesWhitelist &&
        polynamesWhitelist.includes(
          o.tableKey || o.tableKeys[settings.dataset || 'annual']
        ));
    return isGlobal || hasPolyname;
  });

export const getSettingsConfig = ({
  settingsConfig,
  settings,
  dataOptions,
  polynamesWhitelist,
  pendingKeys,
  status,
}) =>
  settingsConfig &&
  settingsConfig
    .filter(
      (s) =>
        status !== 'pending' ||
        !pendingKeys ||
        (pendingKeys && pendingKeys.includes(s.key))
    )
    .map((o) => {
      const {
        key,
        label,
        compareKey,
        startKey,
        endKey,
        options,
        whitelist,
        blacklist,
        locationType,
        noSort,
      } = o || {};
      let mergedOptions =
        (dataOptions && dataOptions[key]) || options || allOptions[key];
      if (key === 'extentYear' && label === 'Tree cover dataset') {
        mergedOptions = allOptions.treeCoverDatasets;
      }
      if (key === 'forestType') {
        mergedOptions =
          mergedOptions &&
          getForestTypes({
            forestTypes: mergedOptions,
            settings,
            polynamesWhitelist,
            locationType,
          });
      } else if (key === 'landCategory') {
        mergedOptions =
          mergedOptions &&
          getLandCategories({
            landCategories: mergedOptions,
            polynamesWhitelist,
            locationType,
          });
      }

      const parsedOptions = noSort
        ? mergedOptions
        : sortBy(mergedOptions, 'label');

      return {
        ...o,
        ...(parsedOptions && {
          options: parsedOptions.filter(
            (opt) =>
              (!whitelist || whitelist.includes(opt.value)) &&
              (!blacklist || !blacklist.includes(opt.value))
          ),
          value: parsedOptions.find((opt) => opt.value === settings[key]),
          ...(startKey && {
            startOptions: parsedOptions.filter(
              (opt) => opt.value <= settings[endKey]
            ),
            startValue: parsedOptions.find(
              (opt) => opt.value === settings[startKey]
            ),
          }),
          ...(endKey && {
            endOptions: parsedOptions.filter(
              (opt) => opt.value >= settings[startKey]
            ),
            endValue: parsedOptions.find(
              (opt) => opt.value === settings[endKey]
            ),
          }),
          ...(compareKey && {
            compareOptions: parsedOptions.filter(
              (opt) => opt.value !== settings[key]
            ),
            compareValue: parsedOptions.find(
              (opt) => opt.value === settings[compareKey]
            ),
          }),
        }),
        ...(o.type === 'datepicker' && {
          ...dataOptions,
          startValue: settings[startKey],
          endValue: settings[endKey],
        }),
      };
    });

export const getOptionsSelected = (options) =>
  options &&
  options.reduce(
    (obj, option) => ({
      ...obj,
      [option.key]: option.options.find((o) => o === option.value),
    }),
    {}
  );

export const getIndicator = (forestType, landCategory) => {
  if (!forestType && !landCategory) return null;
  let label = '';
  let value = '';
  let forestTypeLabel = (forestType && forestType.label) || '';
  let landCatLabel = (landCategory && landCategory.label) || '';

  forestTypeLabel =
    forestType && forestType.preserveString === true
      ? forestTypeLabel
      : forestTypeLabel.toLowerCase();
  landCatLabel =
    landCategory && landCategory.preserveString === true
      ? landCatLabel
      : landCatLabel.toLowerCase();

  if (forestType && landCategory) {
    label = `${forestTypeLabel} PLACEHOLDER ${landCatLabel}`;
    value = `${forestType.value}__${landCategory.value}`;
  } else if (landCategory) {
    label = landCatLabel;
    value = landCategory.value;
  } else {
    label = forestTypeLabel;
    value = forestType.value;
  }

  return {
    label,
    value,
  };
};

export const getWidgetDatasets = ({
  datasets,
  extentYear,
  startYear,
  endYear,
  year,
  weeks,
  startDateAbsolute,
  endDateAbsolute,
  latestDate,
  threshold,
  dataset,
  adminLevel,
}) => {
  return (
    datasets &&
    datasets
      // @modis if dataset is modis, remove it from map
      .filter((d) => dataset !== 'modis' || d.boundary)
      .map((d) => ({
        ...d,
        opacity: 1,
        visibility: true,
        ...(!d.boundary && {
          layers:
            extentYear && !Array.isArray(d.layers)
              ? [d.layers[extentYear]]
              : d.layers,
          dataset:
            extentYear && typeof d.dataset !== 'string'
              ? d.dataset[extentYear]
              : d.dataset,
          ...(((startYear && endYear) || year) && {
            timelineParams: {
              startDate: `${startYear || year}-01-01`,
              endDate: `${endYear || year}-12-31`,
              trimEndDate: `${endYear || year}-12-31`,
            },
          }),
          ...(weeks && {
            timelineParams: {
              startDate: moment(latestDate || undefined)
                .subtract(weeks, 'weeks')
                .format('YYYY-MM-DD'),
              endDate: moment(latestDate || undefined).format('YYYY-MM-DD'),
              trimEndDate: moment(latestDate || undefined).format('YYYY-MM-DD'),
              startDateAbsolute:
                dataset === 'viirs' &&
                moment(latestDate).diff(
                  moment(latestDate || undefined).subtract(weeks, 'weeks'),
                  'days'
                ) > 90
                  ? moment(latestDate).subtract(90, 'days').format('YYYY-MM-DD')
                  : moment(latestDate || undefined)
                      .subtract(weeks, 'weeks')
                      .format('YYYY-MM-DD'),
              endDateAbsolute: latestDate,
            },
          }),
          ...((threshold || adminLevel) && {
            params: {
              threshold,
              visibility: true,
              adm_level:
                adminLevel === 'global' ? 'adm0' : adminLevel || 'adm0',
            },
          }),
          ...(startDateAbsolute &&
            endDateAbsolute && {
              timelineParams: {
                startDateAbsolute:
                  dataset === 'viirs' &&
                  moment(endDateAbsolute).diff(
                    moment(startDateAbsolute),
                    'days'
                  ) > 90
                    ? moment(endDateAbsolute)
                        .subtract(90, 'days')
                        .format('YYYY-MM-DD')
                    : startDateAbsolute,
                endDateAbsolute,
                startDate:
                  dataset === 'viirs' &&
                  moment(endDateAbsolute).diff(
                    moment(startDateAbsolute),
                    'days'
                  ) > 90
                    ? moment(endDateAbsolute)
                        .subtract(90, 'days')
                        .format('YYYY-MM-DD')
                    : startDateAbsolute,
                endDate: endDateAbsolute,
                trimEndDate: endDateAbsolute,
              },
            }),
        }),
      }))
  );
};

export const getPolynameDatasets = ({ optionsSelected, settings }) => {
  const { ifl, forestType, landCategory } = settings;
  const polynames = [
    ...allOptions.forestType,
    ...allOptions.landCategory,
  ].filter((p) => [forestType, landCategory].includes(p.value));
  const iflYear =
    optionsSelected &&
    optionsSelected.ifl &&
    optionsSelected.ifl.find((opt) => opt.value === ifl);

  return (
    polynames &&
    polynames.flatMap(
      (polyname) =>
        polyname.datasets &&
        polyname.datasets.map((d) => ({
          opacity: 0.7,
          visibility: true,
          ...d,
          sqlParams: iflYear && {
            where: {
              class: iflYear.layerValue,
            },
          },
        }))
    )
  );
};

export const getNonGlobalIndicator = ({
  forestType,
  landCategory,
  type,
  datasets,
}) => {
  if (!datasets || type !== 'global') return null;

  const forestTypeCount = datasets[forestType && forestType.value];
  const landCategoryCount = datasets[landCategory && landCategory.value];

  const indicators = [];
  if (forestTypeCount) {
    indicators.push({
      label: forestType.label,
      count: forestTypeCount,
    });
  }
  if (landCategoryCount) {
    indicators.push({
      label: landCategory.label,
      count: landCategoryCount,
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
  datasets,
}) => {
  if (!settings) return null;
  const { extentYear, threshold, decile } = settings;

  const indicators = getNonGlobalIndicator({
    forestType,
    landCategory,
    type,
    datasets,
  });

  const indicatorStatements =
    indicators &&
    indicators.map((i) =>
      i
        ? translateText(
            '*{indicator} are available in {datasetsCount} countries only',
            {
              indicator: i.label.toLowerCase(),
              datasetsCount: i.count,
            }
          )
        : null
    );

  // @TODO: Extract this to widget configs
  const carbonGain = dataType === 'flux' ? ' and tree cover gain' : '';
  const statements = compact([
    extentYear &&
    dataType !== 'lossPrimary' &&
    dataType !== 'fires' &&
    dataType !== 'gain' &&
    dataType !== 'tropicalExtent'
      ? translateText('{extentYear} tree cover extent', { extentYear })
      : null,
    dataType === 'tropicalExtent'
      ? translateText('{extentYear} tropical tree cover extent', { extentYear })
      : null,
    dataType === 'lossPrimary'
      ? translateText('2001 primary forest extent remaining')
      : null,
    (threshold || threshold === 0) &&
    dataType !== 'gain' &&
    dataType !== 'tropicalExtent'
      ? translateText('>{threshold}% tree canopy{carbonGain}', {
          threshold,
          carbonGain,
        })
      : null,
    (decile || decile === 0) && dataType === 'tropicalExtent'
      ? translateText('>{decile}% threshold', {
          decile,
        })
      : null,
    dataType === 'loss'
      ? translateText(
          'these estimates do not take tree cover gain into account'
        )
      : null,
    dataType === 'nlcd_landcover'
      ? translateText(
          '*raw NLCD categories have been re-classed to match IPCC categories'
        )
      : null,
    dataType === 'glad' && type === 'country'
      ? translateText(
          'GLAD alerts become "high confidence" when loss is detected in multiple Landsat images. Only a small percentage of recent alerts will be "high confidence" because it can take weeks or even months for another cloud free image. Learn more here.'
        )
      : null,
    dataType === 'integration_alerts'
      ? translateText(
          'Note: area does not necessarily correspond to area of tree cover loss.'
        )
      : null,
    dataType === 'netChange'
      ? translateText(
          'Disturbance represents areas that experienced both loss and gain between 2000 and 2020'
        )
      : null,
    ...(indicatorStatements || []),
  ]);

  if (dataType === 'naturalForest') {
    return [];
  }

  return statements;
};

export const getLocationPath = (pathname, type, query, params) => {
  const pathObj = {
    payload: {
      type: type === 'global' ? 'country' : type,
      ...params,
    },
    query: {
      ...query,
      map: {
        ...(query && query.map),
        canBound: true,
      },
    },
  };

  if (pathObj.query.location) {
    delete pathObj.query.location;
  }

  return {
    href: pathname,
    as: `${pathname.replace(
      '[[...location]]',
      Object.values(pathObj.payload).join('/')
    )}?${encodeQueryParams(pathObj.query)}`,
  };
};
