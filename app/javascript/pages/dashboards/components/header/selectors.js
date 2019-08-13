import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';
import { deburrUpper } from 'utils/data';

import { getGeodescriberDescription } from 'providers/geodescriber-provider/selectors';

// get list data
export const selectLocation = state =>
  (state.location && state.location.payload) || null;
export const selectLoading = state =>
  state.header &&
  state.countryData &&
  state.areas &&
  state.geostore &&
  (state.header.loading ||
    state.areas.loading ||
    state.geostore.loading ||
    state.countryData.isCountriesLoading ||
    state.countryData.isRegionsLoading ||
    state.countryData.isSubRegionsLoading);
export const selectError = state => state.header && state.header.error;
export const selectCountryData = state =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions,
    links: state.countryData.countryLinks
  };
export const selectData = state => state.header && state.header.data;
export const selectSettings = state => state.header && state.header.settings;
export const selectSentences = state =>
  (state.header && state.header.config.sentences) || null;
export const selectAreas = state => state && state.areas && state.areas.data;
export const selectGeodescriber = state =>
  state && state.geostore && state.geostore.data.geodescriber;

export const getAreasOptions = createSelector([selectAreas], areas => {
  if (!areas) return null;
  return {
    adm0: areas.map(a => ({
      label: a.name,
      value: a.id
    }))
  };
});

export const getAdminMetadata = createSelector(
  [selectLocation, selectCountryData, getAreasOptions],
  (location, countries, areas) => {
    if (!countries || !areas) return null;
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
      typeVerb: 'an area of interest',
      typeName: 'area of interest'
    };
  }
  return {
    typeVerb: `a ${newType}`,
    typeName: newType
  };
});

export const getHeaderProps = createStructuredSelector({
  loading: selectLoading,
  error: selectError,
  location: selectLocation,
  adm0s: getAdm0Data,
  adm1s: getAdm1Data,
  adm2s: getAdm2Data,
  settings: selectSettings,
  downloadLink: getDownloadLink,
  forestAtlasLink: getForestAtlasLink,
  shareData: getShareData,
  sentence: getGeodescriberDescription,
  locationNames: getAdminsSelected,
  selectorMeta: getSelectorMeta
});
