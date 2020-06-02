import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

import { buildFullLocationName } from 'utils/format';
import tropicalIsos from 'data/tropical-isos.json';

import { getDataLocation } from 'utils/location';
import { getActiveArea } from 'providers/areas-provider/selectors';

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
      'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.'
  },
  co2Emissions: ', equivalent to {emissions} of CO\u2082 of emissions.',
  end: '.'
};

export const selectGeojson = state =>
  state.geostore && state.geostore.data && state.geostore.data.geojson;
export const selectGeodescriber = state =>
  state.geodescriber && state.geodescriber.data;
export const selectLoading = state =>
  state.geodescriber && state.geodescriber.loading;
export const selectCountryData = state =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions
  };

export const selectActiveLang = state =>
  (state.location &&
    state.location &&
    state.location.query &&
    state.location.query.lang) ||
  JSON.parse(localStorage.getItem('txlive:selectedlang')) ||
  'en';

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
  [getAdm0Data, getAdm1Data, getAdm2Data, getDataLocation],
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
  [getDataLocation, getAdm0Data, getAdm1Data, getAdm2Data],
  (location, adm0s, adm1s, adm2s) =>
    buildFullLocationName(location, { adm0s, adm1s, adm2s })
);

export const getGeodescriberTitle = createSelector(
  [selectGeodescriber, getDataLocation, getAdminLocationName, getActiveArea],
  (geodescriber, location, adminTitle, activeArea) => {
    if (isEmpty(geodescriber)) return {};

    if (
      (location.type === 'aoi' || location.areaId) &&
      activeArea &&
      activeArea.userArea
    ) {
      return {
        sentence: activeArea.name
      };
    }

    // if not an admin we can use geodescriber
    if (!['global', 'country'].includes(location.type)) {
      return {
        sentence: geodescriber.title,
        params: geodescriber.title_params
      };
    }

    // if an admin we need to calculate the params
    return {
      sentence: adminTitle
    };
  }
);

export const getGeodescriberTitleFull = createSelector(
  [getGeodescriberTitle],
  title => {
    if (isEmpty(title)) return null;

    let sentence = title.sentence;
    if (title.params) {
      Object.keys(title.params).forEach(p => {
        sentence = sentence.replace(`{${p}}`, title.params[p]);
      });
    }
    return sentence;
  }
);

export const getAdminDescription = createSelector(
  [getAdminsSelected, selectGeodescriber, getDataLocation],
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
    const {
      extent,
      plantationsExtent,
      primaryExtent,
      totalArea,
      totalLoss,
      plantationsLoss,
      primaryLoss
    } =
      data || {};
    const { area, emissions, year } = totalLoss || {};
    const { area: areaPlantations, emissions: emissionsPlantations } =
      plantationsLoss || {};
    const { area: areaPrimary, emissions: emissionsPrimary } =
      primaryLoss || {};

    const extentFormatted =
      extent < 1 ? format('.3r')(extent) : format('.3s')(extent);
    const naturalForest =
      extent - plantationsExtent < 1
        ? format('.3r')(extent - plantationsExtent)
        : format('.3s')(extent - plantationsExtent);
    const primaryForest =
      primaryExtent < 1
        ? format('.3r')(primaryExtent)
        : format('.3s')(primaryExtent);
    const percentageCover =
      extent && totalArea ? format('.2r')(extent / totalArea * 100) : 0;
    const percentageNatForest = format('.2r')(
      (extent - plantationsExtent) / totalArea * 100
    );
    const percentagePrimaryForest = format('.2r')(
      primaryExtent / totalArea * 100
    );
    const naturalLoss = format('.3s')((area || 0) - (areaPlantations || 0));
    const emissionsNaturalForest = format('.3s')(
      (emissions || 0) - (emissionsPlantations || 0)
    );
    const emissionsFormatted = format('.3s')(emissions);
    const emissionsPrimaryFormatted = format('.3s')(emissionsPrimary || 0);
    const primaryLossFormatted = format('.3s')(areaPrimary || 0);
    const loss = format('.3s')(area || 0);
    const location = locationNames && locationNames.label;
    const { adm0 } = locationObj || {};

    const params = {
      extent: `${extentFormatted}ha`,
      naturalForest: `${naturalForest}ha`,
      primaryForest: `${primaryForest}ha`,
      location: location || 'the world',
      percentage: `${percentageCover}%`,
      percentageNatForest: `${percentageNatForest}%`,
      percentagePrimaryForest: `${percentagePrimaryForest}%`,
      loss: `${loss}ha`,
      emissions: `${emissionsNaturalForest}t`,
      emissionsTreeCover: `${emissionsFormatted}t`,
      emissionsPrimary: `${emissionsPrimaryFormatted}t`,
      year,
      treeCoverLoss: `${loss}ha`,
      primaryLoss: `${primaryLossFormatted}ha`,
      naturalLoss: `${naturalLoss}ha`
    };

    let sentence = adminSentences.default;
    if (extent > 0 && totalLoss.area) {
      sentence = areaPlantations && location ? withPlantationLoss : withLoss;
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
  [selectGeodescriber, getDataLocation, getAdminDescription],
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
  location: getDataLocation,
  geojson: selectGeojson,
  lang: selectActiveLang
});
