import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import { buildFullLocationName } from 'utils/format';

const selectLoggedIn = state =>
  (state.myGfw && !isEmpty(state.myGfw.data)) || null;
const selectLocation = state => state.location && state.location.payload;
const selectedCountries = state =>
  state.countryData && state.countryData.countries;
const selectedRegions = state => state.countryData && state.countryData.regions;
const selectedSubRegion = state =>
  state.countryData && state.countryData.subRegions;
const selectPageLocation = state =>
  state.location && state.location.routesMap[state.location.type];

// get lists selected
export const getMetadata = createSelector(
  [
    selectPageLocation,
    selectLocation,
    selectedCountries,
    selectedRegions,
    selectedSubRegion
  ],
  (route, location, adm0s, adm1s, adm2s) => {
    const { type, adm0, adm1, adm2 } = location;
    const metadata = window.metadata[route && route.controller];
    const metadataTypes = window.metadata.types;

    if (!type) return metadata;
    if (
      (adm0 && !adm0s.length) ||
      (adm1 && !adm1s.length) ||
      (adm2 && !adm2s.length)
    ) {
      return null;
    }
    let title = `${upperFirst(
      (metadataTypes && metadataTypes[type]) || type
    )} | ${metadata && metadata.title}`;
    if (location.type && location.type === 'country') {
      title = `${buildFullLocationName(location, { adm0s, adm1s, adm2s })} | ${
        title
      }`;
    }

    return {
      ...metadata,
      title
    };
  }
);

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  route: selectPageLocation,
  metadata: getMetadata
});
