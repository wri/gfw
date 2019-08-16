import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

import { buildFullLocationName } from 'utils/format';
import tropicalIsos from 'data/tropical-isos.json';

const adminSentences = {
  default:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
  withLoss:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
  globalInitial:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover.',
  withPlantationLoss:
    'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest',
  countrySpecific: {
    IDN:
      'In 2010, {location} had {naturalForest} of natural forest, extending over {percentageNatForest} of its land area. In {year}, it lost {loss} of tree cover, equivalent to {emissionsTreeCover} of CO₂ of emissions. {primaryLoss} of this loss occurred within primary forests and {naturalLoss} within natural forest.'
  },
  co2Emissions: ', equivalent to {emission} of CO\u2082 of emissions.',
  end: '.'
};

export const selectGeojson = state =>
  state.geostore && state.geostore.data && state.geostore.data.geojson;
export const selectGeodescriber = state =>
  state.geodescriber && state.geodescriber.data;
export const selectLoading = state =>
  state.geodescriber && state.geodescriber.loading;
export const selectLocation = state => state.location && state.location.payload;
export const selectCountryData = state =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions
  };
export const selectAreas = state => state && state.areas && state.areas.data;

export const getAreaName = createSelector(
  [selectAreas, selectLocation],
  (areas, location) => {
    if (!areas || !areas.length || location.type !== 'aoi') return null;
    const activeArea = areas.find(a => a.id === location.adm0);

    return activeArea && activeArea.name;
  }
);

export const getAdm0Data = createSelector(
  [selectCountryData],
  data => data && data.adm0
);

export const getAdm1Data = createSelector(
  [selectCountryData],
  data => data && data.adm1
);

export const getAdm2Data = createSelector(
  [selectCountryData],
  data => data && data.adm2
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

export const getAdminLocationName = createSelector(
  [selectLocation, getAdm0Data, getAdm1Data, getAdm2Data],
  (location, adm0s, adm1s, adm2s) =>
    buildFullLocationName(location, { adm0s, adm1s, adm2s })
);

export const getGeodescriberTitle = createSelector(
  [selectGeodescriber, selectLocation, getAdminLocationName, getAreaName],
  (geodescriber, location, adminTitle, areasName) => {
    if (isEmpty(geodescriber)) return {};

    if (location.type === 'aoi') {
      return {
        sentence: areasName
      };
    }

    // if not an admin we can use geodescriber
    if (!['global', 'country'].includes(location.type)) {
      return {
        sentence: geodescriber.title,
        params: geodescriber.title_params
      };
    }

    // if an admin we needs to calculate the params
    return {
      sentence: adminTitle
    };
  }
);

export const getAdminDescription = createSelector(
  [getAdminsSelected, selectGeodescriber, selectLocation],
  (locationNames, data, locationObj) => {
    if (
      !['global', 'country'].includes(locationObj.type) ||
      isEmpty(data) ||
      isEmpty(locationNames)
    ) {
      return {};
    }
    const {
      withLoss,
      withPlantationLoss,
      globalInitial,
      countrySpecific,
      co2Emissions,
      end
    } = adminSentences;
    const extent =
      data.extent < 1 ? format('.3r')(data.extent) : format('.3s')(data.extent);
    const naturalForest =
      data.extent - data.plantationsExtent < 1
        ? format('.3r')(data.extent - data.plantationsExtent)
        : format('.3s')(data.extent - data.plantationsExtent);
    const percentageCover = format('.2r')(data.extent / data.totalArea * 100);
    const percentageNatForest = format('.2r')(
      (data.extent - data.plantationsExtent) / data.totalArea * 100
    );
    const lossWithoutPlantations =
      data.totalLoss &&
      format('.3s')(data.totalLoss.area - (data.plantationsLoss.area || 0));
    const emissionsWithoutPlantations =
      data.totalLoss &&
      format('.3s')(
        data.totalLoss.emissions - (data.plantationsLoss.emissions || 0)
      );
    const emissions = data.totalLoss && format('.3s')(data.totalLoss.emissions);
    const primaryLoss =
      data.primaryLoss && format('.3s')(data.primaryLoss.area || 0);
    const loss = data.totalLoss && format('.3s')(data.totalLoss.area || 0);
    const location = locationNames && locationNames.label;
    const { adm0 } = locationObj || {};

    const params = {
      extent: `${extent}ha`,
      naturalForest: `${naturalForest}ha`,
      location: location || 'the world',
      percentage: `${percentageCover}%`,
      percentageNatForest: `${percentageNatForest}%`,
      naturalLoss: `${lossWithoutPlantations}ha`,
      loss: `${loss}ha`,
      emission: `${emissionsWithoutPlantations}t`,
      emissionsTreeCover: `${emissions}t`,
      year: data.totalLoss && data.totalLoss.year,
      treeCoverLoss: `${loss}ha`,
      primaryLoss: `${primaryLoss}ha`
    };

    let sentence = adminSentences.default;
    if (data.extent > 0 && data.totalLoss.area) {
      sentence =
        data.plantationsLoss.area && location ? withPlantationLoss : withLoss;
    }
    sentence = tropicalIsos.includes(adm0)
      ? sentence + co2Emissions
      : sentence + end;
    if (!location) sentence = globalInitial;
    if (adm0 in countrySpecific) {
      sentence = countrySpecific[adm0];
    }

    return {
      sentence,
      params
    };
  }
);

export const getGeodescriberDescription = createSelector(
  [selectGeodescriber, selectLocation, getAdminDescription],
  (geodescriber, location, adminSentence) => {
    if (isEmpty(geodescriber)) return {};

    // if not an admin we can use geodescriber
    if (!['global', 'country'].includes(location.type)) {
      return {
        sentence: geodescriber.description,
        params: geodescriber.description_params
      };
    }

    // if an admin we needs to calculate the params
    return adminSentence;
  }
);

export const getGeodescriberProps = createStructuredSelector({
  loading: selectLoading,
  location: selectLocation,
  geojson: selectGeojson
});
