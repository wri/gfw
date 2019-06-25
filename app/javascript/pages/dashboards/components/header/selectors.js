import { createSelector, createStructuredSelector } from 'reselect';
import { biomassToCO2 } from 'utils/calculations';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import upperFirst from 'lodash/upperFirst';
import { deburrUpper } from 'utils/data';
import tropicalIsos from 'data/tropical-isos.json';

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

export const getSentence = createSelector(
  [
    getAdminsSelected,
    selectData,
    selectSentences,
    selectLocation,
    selectGeodescriber
  ],
  (locationNames, data, sentences, locationObj, geoDescriber) => {
    if (locationObj && locationObj.type === 'aoi' && geoDescriber) {
      return {
        sentence: geoDescriber.description,
        params: {}
      };
    }
    if (isEmpty(data) || isEmpty(locationNames)) return {};
    const {
      withLoss,
      withPlantationLoss,
      globalInitial,
      countrySpecific,
      co2Emissions,
      end
    } = sentences;
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
    const lossWithoutPlantations = format('.3s')(
      data.totalLoss.area - (data.plantationsLoss.area || 0)
    );
    const emissionsWithoutPlantations = format('.3s')(
      biomassToCO2(
        data.totalLoss.emissions - (data.plantationsLoss.emissions || 0)
      )
    );
    const emissions = format('.3s')(biomassToCO2(data.totalLoss.emissions));
    const primaryLoss = format('.3s')(data.primaryLoss.area || 0);
    const loss = format('.3s')(data.totalLoss.area || 0);
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
      year: data.totalLoss.year,
      treeCoverLoss: `${loss}ha`,
      primaryLoss: `${primaryLoss}ha`
    };

    let sentence = sentences.default;
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
  sentence: getSentence,
  locationNames: getAdminsSelected,
  selectorMeta: getSelectorMeta
});
