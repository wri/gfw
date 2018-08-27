import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';

import { getLayers, getParsedDatasets } from 'components/map-v2/selectors';

import initialState from './menu-initial-state';
import menuSections from './menu-sections';

const getMenuUrlState = state => (state.query && state.query.menu) || null;
const getLoading = state => state.loading || null;
const getCountries = state => state.countries || null;

export const getMenuSettings = createSelector([getMenuUrlState], urlState => ({
  ...initialState,
  ...urlState
}));

export const getSelectedSection = createSelector(
  [getMenuSettings],
  settings => settings.selectedSection
);

export const getExploreSection = createSelector(
  [getMenuSettings],
  settings => settings.exploreSection
);

export const getAvailableCountries = createSelector(
  [getCountries, getParsedDatasets],
  (countries, datasets) => {
    if (isEmpty(countries) || isEmpty(datasets)) return null;
    const validIsos = flatten(datasets.filter(d => !d.global).map(d => d.iso));
    return countries.filter(c => validIsos.includes(c.value));
  }
);

export const getUnselectedCountries = createSelector(
  [getAvailableCountries, getMenuSettings],
  (countries, settings) => {
    if (!countries) return null;
    const { selectedCountries } = settings;
    return countries.filter(c => !selectedCountries.includes(c.value));
  }
);

export const getActiveCountries = createSelector(
  [getCountries, getMenuSettings],
  (countries, settings) => {
    if (!countries) return null;
    const { selectedCountries } = settings;
    return countries.filter(c => selectedCountries.includes(c.value));
  }
);

export const getSections = createSelector(
  [getParsedDatasets, getActiveCountries],
  (datasets, countries) => {
    if (isEmpty(datasets)) return menuSections;
    return menuSections.map(s => {
      const { slug, subCategories } = s;
      const sectionDatasets =
        datasets && datasets.filter(d => d.tags.includes(slug));
      let subCategoriesWithDatasets = [];
      if (subCategories) {
        subCategoriesWithDatasets = subCategories.map(subCat => ({
          ...subCat,
          datasets:
            sectionDatasets &&
            sectionDatasets.filter(
              d => d.tags.includes(subCat.slug) && d.global
            )
        }));
      }
      let countriesWithDatasets = [];
      if (countries) {
        countriesWithDatasets = countries.map(c => ({
          title: c.label,
          slug: c.value,
          datasets:
            sectionDatasets &&
            sectionDatasets.filter(d => !d.global && d.iso.includes(c.value))
        }));
      }

      return {
        ...s,
        datasets: sectionDatasets,
        subCategories: countriesWithDatasets.concat(subCategoriesWithDatasets)
      };
    });
  }
);

export const getSectionsWithData = createSelector(
  [getSections, getLayers],
  (sections, layers) => {
    if (!layers) return sections;
    const datasetIds = layers.map(d => d.dataset);
    return sections.map(s => {
      const { datasets, subCategories } = s;

      return {
        ...s,
        layerCount:
          datasets &&
          datasets.filter(d => layers && datasetIds.includes(d.id)).length,
        datasets:
          datasets &&
          datasets.map(d => ({
            ...d,
            active: datasetIds.includes(d.id)
          })),
        subCategories:
          subCategories &&
          subCategories.map(subCat => ({
            ...subCat,
            datasets:
              subCat.datasets &&
              subCat.datasets.map(d => ({
                ...d,
                active: datasetIds.includes(d.id)
              }))
          }))
      };
    });
  }
);

export const getActiveSection = createSelector(
  [getSectionsWithData, getSelectedSection],
  (sections, selectedSection) => {
    if (!sections || !selectedSection) return null;
    return sections.find(s => s.slug === selectedSection);
  }
);

export const getActiveSectionWithData = createSelector(
  [getActiveSection],
  section => {
    if (!section) return null;
    const subCatsWithData =
      section.subCategories &&
      section.subCategories.filter(s => !isEmpty(s.datasets));

    return {
      ...section,
      ...(!isEmpty(subCatsWithData) && {
        subCategories: subCatsWithData
      })
    };
  }
);

export const getZeroDataCountries = createSelector(
  [getActiveSection],
  section => {
    if (!section) return null;
    const noDataCountries =
      section.subCategories &&
      section.subCategories.filter(s => isEmpty(s.datasets));
    return noDataCountries ? noDataCountries.map(s => s.title) : null;
  }
);

export const getMenuProps = createStructuredSelector({
  sections: getSectionsWithData,
  activeSection: getActiveSectionWithData,
  selectedSection: getSelectedSection,
  countriesWithoutData: getZeroDataCountries,
  exploreSection: getExploreSection,
  countries: getUnselectedCountries,
  selectedCountries: getActiveCountries,
  layers: getLayers,
  loading: getLoading
});
