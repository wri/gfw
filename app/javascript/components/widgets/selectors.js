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

const buildLocationDict = (locations) => location &&
  locations.length &&
  locations.reduce(
    (dict, next) => ({
      ...dict,
      [next.value]: next.label
    }),
    {}
  );

export const selectLocation = state => state.location && state.location.payload;
export const selectLocationQuery = state => state.location && state.location.query && state.location.query;
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
export const selectPolynameWhitelist = state => state.whitelists && state.whitelists.data;
export const selectEmbed = (state, { embed }) => embed;
export const selectCategory = state =>
  state.location && state.location.query && state.location.query.category;

export const getWdigetFromQuery = createSelector(
  selectLocationQuery,
  query => query && query.widget
);

export const getLocation = createSelector(
  [selectLocation, selectGeostore, getGeodescriberTitleFull],
  (location, geostore, title) => {
    const adminLevel = locationLevelToStr(location);

    if (location.type !== 'aoi' || !geostore) {
      return {
        ...location,
        adminLevel,
        label: title
      };
    }

    return {
      ...location,
      type: 'geostore',
      adm0: geostore.id,
      adminLevel: locationLevelToStr(location),
      label: title,
      tropical: location && tropicalIsos.includes(location.adm0)
    };
  }
);

export const getAllLocationData = createSelector(
  [getLocation, selectCountryData, getAllAreas],
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
  [getLocation, getAllLocationData],
  (location, allLocationData) => {
    if (isEmpty(allLocationData)) return null;
    const { adminLevel, type } = location;

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

    return {
      type: locationTypes[type],
      parent,
      parentLabel: parent && parent.label,
      parentData: buildLocationDict(parentData),
      location: locationData && locationData.find(d => d.value === location[adminLevel]),
      locationData: locationData && buildLocationDict(locationData),
      children: children && buildLocationDict(children)
    };
  }
);

export const filterWidgets = createSelector(
  [selectLocation, selectPolynameWhitelist, selectEmbed, getWdigetFromQuery, selectCategory],
  (location, polynameWhitelist, embed, widget, category) => {
    const { adminLevel, type } = location;

    const widgets = Object.values(allWidgets).map(w => ({
      ...w,
      colors: colors[w.colors]
    }));

    if (embed && widget) return widgets.filter(w => w.widget === widget);

    return sortBy(widgets.filter(w => {
      const { types, admins, whitelists, categories } = w || {};

      const hasLocation = types && types.includes(type) && admins && admins.includes(adminLevel);
      const adminWhitelist = whitelists && whitelists[adminLevel];
      const matchesAdminWhitelist = !adminWhitelist || adminWhitelist.includes(location[adminLevel]);
      const matchesPolynameWhitelist = !whitelists || !whitelists.indicators || intersection(polynameWhitelist, whitelists.indicators);
      const hasCategory = !category && categories.includes(category);

      return (hasLocation && matchesAdminWhitelist && matchesPolynameWhitelist && hasCategory);
    }), category ? `sortOrder[${category}]` : 'sortOrder.summary');
  }
);

export const getWidgets = createSelector(
  [filterWidgets],
  (widgets) => widgets
);

export const getWidgetsProps = createStructuredSelector({
  widgets: getWidgets,
  loading: selectLoading,
  location: getLocation,
  locationData: getLocationData,
  widgetsData: selectWidgetsData,
  query: selectLocationQuery
});
