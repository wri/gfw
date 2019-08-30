import { createSelector, createStructuredSelector } from 'reselect';
import { pluralise } from 'utils/strings';
import { flattenObj } from 'utils/data';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import range from 'lodash/range';

import landCategories from 'data/land-categories.json';
import forestTypes from 'data/forest-types.json';

export const selectAllPropsAndState = (state, ownProps) => ownProps;
export const selectWidgetSettings = (state, { settings }) => settings;
export const selectWidgetConfig = (state, { config }) => config;
export const selectWidgetOptions = (state, { options }) => options;
export const selectWidgetUrlState = (state, { widget }) =>
  state.location && state.location.query && state.location.query[widget];
export const selectWidgetFromState = (state, { widget }) =>
  state.widgets && state.widgets.widgets[widget];
export const selectWidgetActive = (state, { activeWidget, widget }) =>
  activeWidget === widget;
export const selectWidgetActiveData = (state, { widget }) =>
  state.widgets && state.widgets.settings[widget];

export const getWidgetStateData = createSelector(
  [selectWidgetFromState],
  state => state && state.data
);

export const getWidgetSettings = createSelector(
  [selectWidgetUrlState, selectWidgetSettings, selectWidgetActiveData],
  (urlState, settings, activeData) => ({
    ...settings,
    ...urlState,
    activeData: {
      ...activeData
    }
  })
);

export const getWidgetOptionsFromData = createSelector(
  [selectWidgetFromState, selectAllPropsAndState, getWidgetSettings],
  (widgetState, widgetProps) =>
    widgetProps.getDataOptions && {
      ...widgetProps.getDataOptions({
        ...widgetState
      })
    }
);

export const getWidgetOptions = createSelector(
  [selectWidgetOptions, getWidgetOptionsFromData, getWidgetSettings],
  (options, dataOptions, settings) => {
    const { forestTypes: fTypes } = options || {};

    return {
      ...options,
      ...dataOptions,
      ...(fTypes &&
        fTypes.length &&
        fTypes.find(f => f.value === 'ifl') && {
        forestTypes: fTypes.map(f => ({
          ...f,
          label: f.label.includes('{iflYear}')
            ? f.label.replace('{iflYear}', settings.ifl)
            : f.label
        }))
      })
    };
  }
);

export const getRangeYears = createSelector(
  [getWidgetStateData, selectWidgetConfig],
  (data, config) => {
    const { startYears, endYears, yearsRange } = config.options || {};
    if (!startYears || !endYears || isEmpty(data)) return null;
    let years =
      data.years ||
      (yearsRange && range(yearsRange[0], yearsRange[1] + 1)) ||
      [];
    if (!years.length) {
      const flatData = flattenObj(data);
      Object.keys(flatData).forEach(key => {
        if (key.includes('year')) {
          years = years.concat(flatData[key]);
        }
      });
      years = uniq(years);
      years = yearsRange
        ? years.filter(y => y >= yearsRange[0] && y <= yearsRange[1])
        : years;
    }

    return sortBy(
      years.map(y => ({
        label: y,
        value: y
      })),
      'value'
    );
  }
);

export const getOptionsWithYears = createSelector(
  [getWidgetOptions, getRangeYears, getWidgetSettings],
  (options, years, settings) => {
    if (!years || !years.length) return options;
    const { startYear, endYear } = settings;
    return {
      ...options,
      startYears: years.filter(y => y.value <= endYear),
      endYears: years.filter(y => y.value >= startYear)
    };
  }
);

export const getOptionsSelected = createSelector(
  [getWidgetSettings, getOptionsWithYears],
  (settings, options) => {
    if (!options || !settings) return null;
    return {
      ...Object.keys(settings).reduce((obj, settingsKey) => {
        const optionsKey = pluralise(settingsKey);
        const hasOptions = options[optionsKey];
        return {
          ...obj,
          ...(hasOptions && {
            [settingsKey]: hasOptions.find(
              o => o.value === settings[settingsKey]
            )
          })
        };
      }, {})
    };
  }
);

export const getForestType = createSelector(
  [getOptionsSelected],
  selected => selected && selected.forestType
);

export const getLandCategory = createSelector(
  [getOptionsSelected],
  selected => selected && selected.landCategory
);

export const getPolynames = createSelector(
  [getForestType, getLandCategory],
  (forestType, landCategory) => {
    if (!forestType && !landCategory) return null;
    return [
      ...((forestType &&
        forestTypes.filter(f => f.value === forestType.value && !f.hidden)) ||
        []),
      ...((landCategory &&
        landCategories.filter(
          l => l.value === landCategory.value && !l.hidden
        )) ||
        [])
    ];
  }
);

export const getIndicator = createSelector(
  [getForestType, getLandCategory],
  (forestType, landCategory) => {
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
  }
);

export const getWidgetPropsFromState = createSelector(
  [
    selectWidgetFromState,
    selectAllPropsAndState,
    getWidgetSettings,
    getOptionsSelected,
    getOptionsWithYears,
    getForestType,
    getLandCategory,
    getIndicator
  ],
  (
    widgetState,
    widgetProps,
    settings,
    optionsSelected,
    options,
    forestType,
    landCategory,
    indicator
  ) => ({
    ...widgetProps.getProps({
      ...widgetState,
      ...widgetProps,
      options,
      optionsSelected,
      settings,
      forestType,
      landCategory,
      indicator
    })
  })
);

export const selectParseData = (state, { parseData }) => parseData;

export const getWidgetTitle = createSelector(
  [getWidgetPropsFromState],
  props => props && props.title
);

export const getWidgetSentence = createSelector(
  [getWidgetPropsFromState],
  props => props && props.sentence
);

export const getWidgetData = createSelector(
  [selectParseData, getProps],
  (parseData, props) => parseData(props)
);

export const getWidgetDataConfig = createSelector(
  [getWidgetPropsFromState],
  props => props && props.dataConfig
);




// import { getIsTrase } from 'app/layouts/root/selectors';

// export const getNonGlobalIndicator = createSelector(
//   [
//     getIndicator,
//     getForestType,
//     getLandCategory,
//     getLocation,
//     getNonGlobalDatasets
//   ],
//   (indicator, forestType, landCategory, location, datasets) => {
//     if (!datasets || location.type !== 'global' || !indicator) return null;
//     if (datasets[indicator.value]) {
//       return indicator;
//     } else if (datasets[forestType && forestType.value]) {
//       return forestType;
//     } else if (datasets[landCategory && landCategory.value]) {
//       return landCategory;
//     }
//     return null;
//   }
// );

// // get lists selected
// export const getStatements = createSelector(
//   [getSettings, getType, getNonGlobalDatasets, getNonGlobalIndicator],
//   (settings, type, datasets, indicator) => {
//     if (!settings) return '';
//     const { extentYear, threshold } = settings;

//     const statements = compact([
//       extentYear
//         ? translateText('{extentYear} tree cover extent', { extentYear })
//         : null,
//       threshold || threshold === 0
//         ? translateText('>{threshold}% tree canopy', { threshold })
//         : null,
//       type === 'loss'
//         ? translateText(
//           'these estimates do not take tree cover gain into account'
//         )
//         : null,
//       datasets && indicator
//         ? translateText(
//           '*{indicator} are available in {datasetsCount} countries only',
//           {
//             indicator: indicator.label.toLowerCase(),
//             datasetsCount: datasets[indicator.value]
//           }
//         )
//         : null
//     ]);

//     return statements;
//   }
// );


//   // dsalkdsa;lkas

//   import { createSelector, createStructuredSelector } from 'reselect';
// import moment from 'moment';
// import qs from 'query-string';
// import { isTouch } from 'utils/browser';
// import { SCREEN_L } from 'utils/constants';

// export const selectModalOpen = state => state.modalMeta && state.modalMeta.open;
// export const selectModalClosing = state =>
//   state.modalMeta && state.modalMeta.closing;
// export const selectLocation = state => state.location && state.location.payload;
// export const selectSearch = state => state.location && state.location.search;
// export const selectConfig = (state, { config }) => config;
// export const selectTitle = (state, { config, title }) => title || config.title;
// export const selectWidget = (state, { widget }) => widget;
// export const selectLocationName = (state, { locationName }) => locationName;
// export const selectWidgetMetaKey = (state, { config, widget, whitelist }) =>
//   (widget === 'treeCover' &&
//   whitelist &&
//   whitelist.length &&
//   whitelist.includes('plantations')
//     ? 'widget_natural_vs_planted'
//     : config.metaKey);

// export const getParsedTitle = createSelector(
//   [selectTitle, selectLocationName],
//   (title, locationName) => {
//     const titleString = typeof title === 'string' ? title : title.default;
//     return titleString && titleString.replace('{location}', locationName || '');
//   }
// );

// export const getShareData = createSelector(
//   [getParsedTitle, selectConfig, selectSearch, selectLocation, selectWidget],
//   (title, config, search, location, widget) => {
//     const query = qs.parse(search);
//     const { category } = query || {};
//     const { type, adm0, adm1, adm2 } = location || {};
//     const locationUrl = `dashboards/${type}/${adm0 || ''}${
//       adm1 ? `/${adm1}` : ''
//     }${adm2 ? `/${adm2}` : ''}`;
//     const widgetQuery = `widget=${widget}`;
//     const widgetState =
//       query && query[widget] ? `&${widget}=${query[widget]}` : '';
//     const categoryQuery = category ? `&category=${category}` : '';

//     const shareUrl = `${window.location.origin}/${locationUrl}?${widgetQuery}${
//       widgetState ? `${widgetState}` : ''
//     }${categoryQuery}#${widget}`;
//     const embedUrl = `${window.location.origin}/embed/${locationUrl}?${
//       widgetQuery
//     }${widgetState}`;
//     return {
//       title: 'Share this widget',
//       subtitle: title,
//       shareUrl,
//       embedUrl,
//       embedSettings:
//         config.size === 'small'
//           ? { width: 315, height: 460 }
//           : { width: 670, height: 490 },
//       socialText: title
//     };
//   }
// );

// export const getCitation = createSelector(
//   [getParsedTitle],
//   title =>
//     (title
//       ? `Global Forest Watch. “${title}”. Accessed on ${moment().format(
//         'MMMM Do YYYY'
//       )} from www.globalforestwatch.org.`
//       : null)
// );

// export const getWidgetHeaderProps = createStructuredSelector({
//   modalOpen: selectModalOpen,
//   modalClosing: selectModalClosing,
//   metakey: selectWidgetMetaKey,
//   shareData: getShareData,
//   title: getParsedTitle,
//   citation: getCitation,
//   isDeviceTouch: () => isTouch() || window.innerWidth < SCREEN_L
// });

export const getWidgetProps = () =>
  createStructuredSelector({
    title: getWidgetTitle,
    sentence: getWidgetSentence,
    data: getWidgetData,
    dataConfig: getWidgetDataConfig,
    settings: getWidgetSettings,
    active: selectWidgetActive
  });
