import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';

import { getLayers, getParsedDatasets } from 'components/map/map-selectors';

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
    const validIsos = flatten(datasets.map(d => d.iso));
    return countries.filter(c => validIsos.indexOf(c.value) > -1);
  }
);

export const getUnselectedCountries = createSelector(
  [getAvailableCountries, getMenuSettings],
  (countries, settings) => {
    if (!countries) return null;
    const { selectedCountries } = settings;
    return countries.filter(c => selectedCountries.indexOf(c.value) === -1);
  }
);

export const getActiveCountries = createSelector(
  [getCountries, getMenuSettings],
  (countries, settings) => {
    if (!countries) return null;
    const { selectedCountries } = settings;
    return countries.filter(c => selectedCountries.indexOf(c.value) > -1);
  }
);

export const getSections = createSelector(
  [getParsedDatasets, getActiveCountries],
  (datasets, countries) => {
    if (isEmpty(datasets)) return menuSections;
    return menuSections.map(s => {
      const { slug, subCategories } = s;
      const sectionDatasets =
        datasets && datasets.filter(d => d.tags.indexOf(slug) > -1);
      let subCategoriesWithDatasets = [];
      if (subCategories) {
        subCategoriesWithDatasets = subCategories.map(subCat => ({
          ...subCat,
          datasets:
            sectionDatasets &&
            sectionDatasets.filter(
              d => d.tags.indexOf(subCat.slug) > -1 && d.global
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
            sectionDatasets.filter(
              d => !d.global && d.iso.indexOf(c.value) > -1
            )
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
          datasets.filter(d => layers && datasetIds.indexOf(d.id) > -1).length,
        datasets:
          datasets &&
          datasets.map(d => ({
            ...d,
            active: datasetIds.indexOf(d.id) > -1
          })),
        subCategories:
          subCategories &&
          subCategories.map(subCat => ({
            ...subCat,
            datasets:
              subCat.datasets &&
              subCat.datasets.map(d => ({
                ...d,
                active: datasetIds.indexOf(d.id) > -1
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

export const getMenuProps = createStructuredSelector({
  sections: getSectionsWithData,
  activeSection: getActiveSection,
  selectedSection: getSelectedSection,
  exploreSection: getExploreSection,
  countries: getUnselectedCountries,
  selectedCountries: getActiveCountries,
  layers: getLayers,
  loading: getLoading
});
