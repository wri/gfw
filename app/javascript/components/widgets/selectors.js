import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';

import { getAllAreas } from 'providers/areas-provider/selectors';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';

import tropicalIsos from 'data/tropical-isos.json';
import colors from 'data/colors.json';
import { locationLevelToStr } from 'utils/format';
import allWidgets from './manifest';

const locationTypes = {
  country: {
    label: 'country',
    value: 'admin'
  },
  global: {
    label: 'global',
    value: 'global'
  },
  geostore: {
    label: 'your custom area',
    value: 'geostore'
  },
  wdpa: {
    label: 'your selected protected area',
    value: 'wdpa'
  },
  use: {
    label: 'your selected area',
    value: 'use'
  }
};

const buildLocationDict = locations =>
  location &&
  locations.length &&
  locations.reduce(
    (dict, next) => ({
      ...dict,
      [next.value]: {
        label: next.label,
        value: next.value
      }
    }),
    {}
  );

export const selectLocation = state => state.location && state.location.payload;
export const selectLocationQuery = state =>
  state.location && state.location.query && state.location.query;
export const selectWidgetsData = state => state.widgets && state.widgets.data;
export const selectGeostore = state => state.geostore && state.geostore.data;
export const selectLoading = state =>
  state.countryData &&
  state.whitelists &&
  (state.countryData.countriesLoading ||
    state.countryData.regionsLoading ||
    state.countryData.subRegionsLoading ||
    state.whitelists.loading);
export const selectCountryData = state => state.countryData;
export const selectPolynameWhitelist = state =>
  state.whitelists && state.whitelists.data;
export const selectEmbed = (state, { embed }) => embed;
export const selectCategory = state =>
  state.location && state.location.query && state.location.query.category;

export const getWdigetFromQuery = createSelector(
  selectLocationQuery,
  query => query && query.widget
);

export const getLocation = createSelector(
  [selectLocation, selectGeostore],
  (location, geostore) => {
    if (location.type === 'aoi' && geostore) {
      return {
        ...location,
        type: 'geostore',
        adm0: geostore.id
      };
    }

    return location;
  }
);

export const getLocationObj = createSelector(
  [getLocation, getGeodescriberTitleFull],
  (location, title) => {
    const { type } = location;

    return {
      ...location,
      locationLabel: locationTypes[type] && locationTypes[type].label,
      adminLevel: locationLevelToStr(location),
      locationLabelFull: title,
      isTropical: location && tropicalIsos.includes(location.adm0)
    };
  }
);

export const getAllLocationData = createSelector(
  [selectLocation, selectCountryData, getAllAreas],
  (location, countryData, areas) => {
    if (isEmpty(areas) && isEmpty(countryData)) return null;
    const { type } = location;

    if (type === 'global' || type === 'country') {
      return {
        adm0: countryData.countries,
        adm1: countryData.regions,
        adm2: countryData.subRegions
      };
    }

    return {};
  }
);

export const getLocationData = createSelector(
  [getLocationObj, getAllLocationData, selectPolynameWhitelist],
  (location, allLocationData, polynames) => {
    if (isEmpty(allLocationData)) return null;
    const { adminLevel } = location;

    let parent = {};
    let parentData = [];
    let children = [];
    if (adminLevel === 'adm0') {
      parent = { label: 'global', value: 'global' };
      children = allLocationData.adm1;
    } else if (adminLevel === 'adm1') {
      parent = allLocationData.adm0.find(d => d.value === location.adm0);
      parentData = allLocationData.adm0;
      children = allLocationData.adm2;
    } else if (adminLevel === 'adm2') {
      parent = allLocationData.adm1.find(d => d.value === location.adm1);
      parentData = allLocationData.adm1;
    }

    const locationData = allLocationData[adminLevel];
    const currentLocation =
      locationData && locationData.find(d => d.value === location[adminLevel]);

    return {
      parent,
      parentLabel: parent && parent.label,
      parentData: buildLocationDict(parentData),
      location: currentLocation,
      locationData: locationData && buildLocationDict(locationData),
      locationLabel: currentLocation && currentLocation.label,
      childData: children && buildLocationDict(children),
      polynames
    };
  }
);

export const filterWidgets = createSelector(
  [
    getLocationObj,
    selectPolynameWhitelist,
    selectEmbed,
    getWdigetFromQuery,
    selectCategory
  ],
  (location, polynameWhitelist, embed, widget, category) => {
    const { adminLevel, type } = location;

    const widgets = Object.values(allWidgets).map(w => ({
      ...w,
      colors: colors[w.colors]
    }));

    if (embed && widget) return widgets.filter(w => w.widget === widget);

    return sortBy(
      widgets.filter(w => {
        const { types, admins, whitelists, categories } = w || {};

        const hasLocation =
          types &&
          types.includes(type) &&
          admins &&
          admins.includes(adminLevel);
        const adminWhitelist = whitelists && whitelists[adminLevel];
        const matchesAdminWhitelist =
          !adminWhitelist || adminWhitelist.includes(location[adminLevel]);
        const matchesPolynameWhitelist =
          !whitelists ||
          !whitelists.indicators ||
          intersection(polynameWhitelist, whitelists.indicators);
        const hasCategory = !category || categories.includes(category);

        return (
          hasLocation &&
          matchesAdminWhitelist &&
          matchesPolynameWhitelist &&
          hasCategory
        );
      }),
      category ? `sortOrder[${category}]` : 'sortOrder.summary'
    );
  }
);

// export const buildWidgetsWithOptions = createSelector(
//   [filterWidgets],
//   (widgets) => {

//     const { startYears, endYears, yearsRange } = config.options || {};
//     if (!startYears || !endYears || isEmpty(data)) return null;
//     let years =
//       data.years ||
//       (yearsRange && range(yearsRange[0], yearsRange[1] + 1)) ||
//       [];
//     if (!years.length) {
//       const flatData = flattenObj(data);
//       Object.keys(flatData).forEach(key => {
//         if (key.includes('year')) {
//           years = years.concat(flatData[key]);
//         }
//       });
//       years = uniq(years);
//       years = yearsRange
//         ? years.filter(y => y >= yearsRange[0] && y <= yearsRange[1])
//         : years;
//     }

//     return sortBy(
//       years.map(y => ({
//         label: y,
//         value: y
//       })),
//       'value'
//     );
//   }
// );

// export const getOptionsWithYears = createSelector(
//   [getWidgetOptions, getRangeYears, getWidgetSettings],
//   (options, years, settings) => {
//     if (!years || !years.length) return options;
//     const { startYear, endYear } = settings;
//     return {
//       ...options,
//       startYears: years.filter(y => y.value <= endYear),
//       endYears: years.filter(y => y.value >= startYear)
//     };
//   }
// );

// export const getOptionsSelected = createSelector(
//   [getWidgetSettings, getOptionsWithYears],
//   (settings, options) => {
//     if (!options || !settings) return null;
//     return {
//       ...Object.keys(settings).reduce((obj, settingsKey) => {
//         const optionsKey = pluralise(settingsKey);
//         const hasOptions = options[optionsKey];
//         return {
//           ...obj,
//           ...(hasOptions && {
//             [settingsKey]: hasOptions.find(
//               o => o.value === settings[settingsKey]
//             )
//           })
//         };
//       }, {})
//     };
//   }
// );

// export const getForestType = createSelector(
//   [getOptionsSelected],
//   selected => selected && selected.forestType
// );

// export const getLandCategory = createSelector(
//   [getOptionsSelected],
//   selected => selected && selected.landCategory
// );

// export const getPolynames = createSelector(
//   [getForestType, getLandCategory],
//   (forestType, landCategory) => {
//     if (!forestType && !landCategory) return null;
//     return [
//       ...((forestType &&
//         forestTypes.filter(f => f.value === forestType.value && !f.hidden)) ||
//         []),
//       ...((landCategory &&
//         landCategories.filter(
//           l => l.value === landCategory.value && !l.hidden
//         )) ||
//         [])
//     ];
//   }
// );

// export const getIndicator = createSelector(
//   [getForestType, getLandCategory],
//   (forestType, landCategory) => {
//     if (!forestType && !landCategory) return null;
//     let label = '';
//     let value = '';
//     if (forestType && landCategory) {
//       label = `${forestType.label} in ${landCategory.label}`;
//       value = `${forestType.value}__${landCategory.value}`;
//     } else if (landCategory) {
//       label = landCategory.label;
//       value = landCategory.value;
//     } else {
//       label = forestType.label;
//       value = forestType.value;
//     }

//     return {
//       label,
//       value
//     };
//   }
// );

export const getWidgets = createSelector([filterWidgets], widgets => widgets);

export const getWidgetsProps = createStructuredSelector({
  widgets: getWidgets,
  loading: selectLoading,
  location: getLocation,
  locationObj: getLocationObj,
  locationData: getLocationData,
  widgetsData: selectWidgetsData,
  query: selectLocationQuery
});
