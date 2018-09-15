import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import { buildFullLocationName } from 'utils/format';

const selectLoggedIn = state => !isEmpty(state.myGfw.data) || null;
const selectLocation = state => state.location && state.location.payload;
const selectedCountries = state => state.countryData.countries;
const selectedRegions = state => state.countryData.regions;
const selectedSubRegion = state => state.countryData.subRegions;
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
  (route, location, adms, adm1s, adm2s) => {
    const { type, country, region, subRegion } = location;
    const metadata = window.metadata[route && route.controller];
    const metadataTypes = window.metadata.types;

    if (!type) return metadata;
    if (
      (country && !adms.length) ||
      (region && !adm1s.length) ||
      (subRegion && !adm2s.length)
    ) {
      return null;
    }
    let title = `${upperFirst(metadataTypes[type] || type)} | ${
      metadata.title
    }`;
    if (location.type && location.type === 'country') {
      title = `${buildFullLocationName(location, { adms, adm1s, adm2s })} | ${
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
