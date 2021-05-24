import { createSelector, createStructuredSelector } from 'reselect';

import { getActiveCategory } from 'components/widgets/selectors';

import { getUserAreas } from 'providers/areas-provider/selectors';

// get list data
export const selectLocation = (state) =>
  state.location && state.location.payload;

export const selectCountryData = (state) =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions,
    links: state.countryData.countryLinks,
  };

export const getAreasOptions = createSelector(
  [getUserAreas, selectLocation],
  (areas, location) => {
    if (
      !areas ||
      !areas.find(
        (a) => a.id === location.adm0 || a.subscriptionId === location.adm0
      )
    ) {
      return null;
    }

    return {
      adm0: areas.map((a) => ({
        label: a.name,
        value: a.id,
        subscriptionId: a.subscriptionId,
      })),
    };
  }
);

export const getAdminMetadata = createSelector(
  [selectLocation, selectCountryData, getAreasOptions],
  (location, countries, areas) => {
    if (location?.type === 'aoi') return areas;
    return countries;
  }
);

export const getAdm0Data = createSelector(
  [getAdminMetadata],
  (data) => data && data.adm0
);

export const getAdm1Data = createSelector(
  [getAdminMetadata],
  (data) => data && data.adm1
);

export const getAdm2Data = createSelector(
  [getAdminMetadata],
  (data) => data && data.adm2
);

export const getAdminsSelected = createSelector(
  [getAdm0Data, getAdm1Data, getAdm2Data, selectLocation],
  (adm0s, adm1s, adm2s, location) => {
    const adm0 =
      (location &&
        location.adm0 &&
        adm0s &&
        adm0s.find(
          (i) => i.value === location.adm0 || i.subscriptionId === location.adm0
        )) ||
      null;
    const adm1 =
      (location &&
        location.adm1 &&
        adm1s &&
        adm1s.find((i) => i.value === location.adm1)) ||
      null;
    const adm2 =
      (location &&
        location.adm2 &&
        adm2s &&
        adm2s.find((i) => i.value === location.adm2)) ||
      null;
    let current = adm0;
    if (location?.adm2) {
      current = adm2;
    } else if (location?.adm1) {
      current = adm1;
    }

    return {
      ...current,
      adm0,
      adm1,
      adm2,
    };
  }
);

export const getGlobalSentenceProps = createStructuredSelector({
  location: selectLocation,
  locationNames: getAdminsSelected,
  category: getActiveCategory,
});
