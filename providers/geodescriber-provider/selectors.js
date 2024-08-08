import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import { selectActiveLang } from 'utils/lang';
import { getDataLocation, buildFullLocationName } from 'utils/location';

import { getActiveArea } from 'providers/areas-provider/selectors';

import { parseSentence } from 'services/sentences';
import { isGeodescriberLocation, dynamicGeodescriberSentence } from 'utils/geodescriber';

export const selectGeojson = (state) =>
  state.geostore && state.geostore.data && state.geostore.data.geojson;
export const selectGeodescriber = (state) =>
  state.geodescriber && state.geodescriber.data;

export const selectWdpaLocation = (state) => state?.geostore?.data?.location;

export const selectLoading = (state) =>
  state.geodescriber && state.geodescriber.loading;
export const selectCountryData = (state) =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions,
  };

export const getAdm0Data = createSelector(
  [selectCountryData],
  (data) => data && data.adm0
);

export const getAdm1Data = createSelector(
  [selectCountryData],
  (data) => data && data.adm1
);

export const getAdm2Data = createSelector(
  [selectCountryData],
  (data) => data && data.adm2
);

export const getAdminsSelected = createSelector(
  [getAdm0Data, getAdm1Data, getAdm2Data, getDataLocation],
  (adm0s, adm1s, adm2s, location) => {
    const adm0 =
      (adm0s && adm0s.find((i) => i.value === location.adm0)) || null;
    const adm1 =
      (adm1s && adm1s.find((i) => i.value === location.adm1)) || null;
    const adm2 =
      (adm2s && adm2s.find((i) => i.value === location.adm2)) || null;
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
      adm2,
    };
  }
);

export const getAdminLocationName = createSelector(
  [getDataLocation, getAdm0Data, getAdm1Data, getAdm2Data],
  (location, adm0s, adm1s, adm2s) =>
    buildFullLocationName(location, { adm0s, adm1s, adm2s })
);

export const getGeodescriberTitle = createSelector(
  [
    selectGeodescriber,
    selectWdpaLocation,
    getDataLocation,
    getAdminLocationName,
    getActiveArea,
  ],
  (geodescriber, wdpaLocation, location, adminTitle, activeArea) => {
    const { title, title_params } = geodescriber;

    if (isEmpty(geodescriber)) return null;

    if (
      (location.type === 'aoi' || location.areaId) &&
      activeArea &&
      activeArea.userArea
    ) {
      return {
        sentence: activeArea.name,
      };
    }
    if (location.type === 'wdpa' && wdpaLocation) {
      return {
        sentence: wdpaLocation?.name,
      };
    }

    // if not an admin we'll parse the geodescriber information
    if (isGeodescriberLocation(location)) {
      return dynamicGeodescriberSentence(title, title_params);
    }

    return {
      sentence: adminTitle,
    };
  }
);

export const getGeodescriberTitleFull = createSelector(
  [getGeodescriberTitle, selectWdpaLocation],
  (title, wdpaLocation) => {
    if (isEmpty(title)) return null;
    let { sentence } = title;
    if (location.type === 'wdpa' && wdpaLocation) {
      return sentence;
    }
    if (title.params) {
      Object.keys(title.params).forEach((p) => {
        sentence = sentence.replace(`{${p}}`, title.params[p]);
      });
    }
    return sentence;
  }
);

export const getAdminDescription = createSelector(
  [getAdminsSelected, selectGeodescriber, getDataLocation],
  (locationNames, data, locationObj) =>
    parseSentence(data, locationNames, locationObj)
);

export const getGeodescriberDescription = createSelector(
  [
    selectGeodescriber,
    getDataLocation,
    selectWdpaLocation,
    getAdminDescription,
  ],
  (geodescriber, location, wdpaLocation, adminSentence) => {
    const { description, description_params } = geodescriber;

    if (isEmpty(geodescriber)) return null;
    if (location.type === 'wdpa' && wdpaLocation) {
      const status = wdpaLocation?.status;
      const marine = wdpaLocation?.marine;
      const status_year = wdpaLocation?.status_yr;
      return {
        sentence: `{name} is a{marine}protected area given {status} ${
          status_year ? 'status in {status_year}.' : 'status.'
        }`,
        params: {
          status: status ? String(status).toLowerCase() : 'unknown',
          status_year,
          marine: marine === 2 ? ' marine ' : ' ',
          name: wdpaLocation?.name,
        },
      };
    }

    // if not an admin we'll parse the geodescriber information
    if (isGeodescriberLocation(location)) {
      return dynamicGeodescriberSentence(description, description_params)
    }

    // if an admin we needs to calculate the params
    return adminSentence;
  }
);

export const getGeodescriberProps = createStructuredSelector({
  loading: selectLoading,
  location: getDataLocation,
  geodescriber: selectGeodescriber,
  geojson: selectGeojson,
  lang: selectActiveLang,
});
