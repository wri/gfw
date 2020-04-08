import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';

import { buildFullLocationName } from 'utils/format';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';

const selectLoggedIn = state =>
  state.myGfw && state.myGfw.data && state.myGfw.data.loggedIn;
const selectLoggingIn = state => state.myGfw && state.myGfw.loading;
const selectLocation = state => state.location && state.location.payload;
const selectedCountries = state =>
  state.countryData && state.countryData.countries;
const selectedRegions = state => state.countryData && state.countryData.regions;
const selectedSubRegion = state =>
  state.countryData && state.countryData.subRegions;
const selectQuery = state => state.location && state.location.query;
const selectPageLocation = state =>
  state.location && state.location.routesMap[state.location.type];
export const selectActiveLang = state =>
  (state.location &&
    state.location &&
    state.location.query &&
    state.location.query.lang) ||
  JSON.parse(localStorage.getItem('txlive:selectedlang')) ||
  'en';

export const getIsGFW = createSelector(
  selectQuery,
  query => query && query.gfw && JSON.parse(query.gfw)
);

export const getIsTrase = createSelector(
  selectQuery,
  query => query && query.trase && JSON.parse(query.trase)
);

export const getMetadata = createSelector(
  [
    selectPageLocation,
    selectLocation,
    selectedCountries,
    selectedRegions,
    selectedSubRegion,
    getGeodescriberTitleFull
  ],
  (route, location, adm0s, adm1s, adm2s, geoTitle) => {
    const { type, adm0, adm1, adm2 } = location;
    const metadata = window.metadata[route && route.controller];

    if (!type) return metadata;
    if (type === 'aoi') {
      return {
        title: geoTitle || ''
      };
    }

    if (
      type === 'country' &&
      ((adm0 && (!adm0s || !adm0s.length)) ||
        (adm1 && (!adm1s || !adm1s.length)) ||
        (adm2 && (!adm2s || !adm2s.length)))
    ) {
      return null;
    }
    const metadataByType = window.metadata[type];
    let title = '';
    if (location && location.type === 'country') {
      title = `${buildFullLocationName(location, {
        adm0s,
        adm1s,
        adm2s
      })} | ${metadata && metadata.title}`;
    } else {
      title = `${upperFirst(
        (metadataByType && metadataByType.title) || type
      )} | ${metadata && metadata.title}`;
    }

    return {
      ...metadata,
      title
    };
  }
);

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  authenticating: selectLoggingIn,
  route: selectPageLocation,
  metadata: getMetadata,
  isGFW: getIsGFW,
  isTrase: getIsTrase
});
