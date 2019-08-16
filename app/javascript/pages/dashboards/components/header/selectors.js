import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';
import { deburrUpper } from 'utils/data';

import { getGeodescriberDescription } from 'providers/geodescriber-provider/selectors';
import {
  getUserAreas,
  getActiveArea
} from 'providers/areas-provider/selectors';

// get list data
export const selectLocation = state => state.location && state.location.payload;
export const selectLoading = state =>
  state.countryData &&
  state.areas &&
  state.geostore &&
  state.geodescriber &&
  (state.areas.loading ||
    state.geostore.loading ||
    state.geodescriber.loading ||
    state.countryData.isCountriesLoading ||
    state.countryData.isRegionsLoading ||
    state.countryData.isSubRegionsLoading);
export const selectError = state =>
  state.geodescriber && state.geodescriber.error;
export const selectCountryData = state =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions,
    links: state.countryData.countryLinks
  };

export const getAreasOptions = createSelector(
  [getUserAreas, selectLocation],
  (areas, location) => {
    if (!areas || !areas.find(a => a.id === location.adm0)) return null;

    return {
      adm0: areas.map(a => ({
        label: a.name,
        value: a.id
      }))
    };
  }
);

export const getDashboardTitle = createSelector(
  [getActiveArea, selectLocation],
  (area, location) => {
    if (!location.adm0) return location.type;
    if (!area || (area && area.userArea)) return null;
    return area.name;
  }
);

export const getAdminMetadata = createSelector(
  [selectLocation, selectCountryData, getAreasOptions],
  (location, countries, areas) => {
    if (location.type === 'aoi') return areas;
    return countries;
  }
);

export const getAdm0Data = createSelector(
  [getAdminMetadata],
  data => data && data.adm0
);

export const getAdm1Data = createSelector(
  [getAdminMetadata],
  data => data && data.adm1
);

export const getAdm2Data = createSelector(
  [getAdminMetadata],
  data => data && data.adm2
);

export const getExternalLinks = createSelector(
  [selectCountryData, selectLocation],
  (data, location) => data && data.links[location.adm0]
);

export const getForestAtlasLink = createSelector(
  [getExternalLinks],
  links =>
    links &&
    links.find(l => deburrUpper(l.title).indexOf(deburrUpper('forest atlas')))
);

export const getDownloadLink = createSelector(
  [selectLocation],
  location =>
    `https://gfw2-data.s3.amazonaws.com/country-pages/country_stats/download/${location.adm0 ||
      'global'}.xlsx`
);

export const getAdminsSelected = createSelector(
  [getAdm0Data, getAdm1Data, getAdm2Data, selectLocation],
  (adm0s, adm1s, adm2s, location) => {
    const adm0 = (adm0s && adm0s.find(i => i.value === location.adm0)) || null;
    const adm1 = (adm1s && adm1s.find(i => i.value === location.adm1)) || null;
    const adm2 = (adm2s && adm2s.find(i => i.value === location.adm2)) || null;
    let current = adm0;
    if (location.adm2) {
      current = adm2;
    } else if (location.adm1) {
      current = adm1;
    }

    return {
      ...current,
      adm0,
      adm1,
      adm2
    };
  }
);

export const getShareData = createSelector(
  [getAdminsSelected, selectLocation],
  (adminsSelected, location) => ({
    title: 'Share this Dashboard',
    shareUrl: `${window.location.href}`,
    socialText: `${(adminsSelected &&
      adminsSelected.adm0 &&
      `${adminsSelected.adm0.label}'s`) ||
      upperFirst(location.type)} dashboard`
  })
);

export const getSelectorMeta = createSelector([selectLocation], location => {
  const { type } = location || {};
  const newType = type === 'global' ? 'country' : type;
  if (type === 'aoi') {
    return {
      typeVerb: 'area of interest',
      typeName: 'area of interest'
    };
  }
  return {
    typeVerb: `${newType}`,
    typeName: newType
  };
});

export const getShareMeta = createSelector(
  [selectLocation, getActiveArea],
  (location, activeArea) => {
    if (location.type === 'aoi' && activeArea && activeArea.userArea) {
      return 'share area';
    } else if (location.type === 'aoi') {
      return 'save to my gfw';
    }

    return 'share dashboard';
  }
);

export const getHeaderProps = createStructuredSelector({
  loading: selectLoading,
  error: selectError,
  location: selectLocation,
  adm0s: getAdm0Data,
  adm1s: getAdm1Data,
  adm2s: getAdm2Data,
  downloadLink: getDownloadLink,
  forestAtlasLink: getForestAtlasLink,
  shareData: getShareData,
  sentence: getGeodescriberDescription,
  locationNames: getAdminsSelected,
  selectorMeta: getSelectorMeta,
  shareMeta: getShareMeta,
  title: getDashboardTitle,
  activeArea: getActiveArea
});
