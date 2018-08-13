import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';

import { getLayers } from 'components/map/map-selectors';

import initialState from './menu-initial-state';
import menuSections from './menu-sections';

const getMenuUrlState = state => (state.query && state.query.menu) || null;
const getDatasets = state => state.datasets || null;
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

const getUnselectedCountries = createSelector(
  [getCountries, getMenuSettings],
  (countries, settings) => {
    if (!countries) return null;
    const { selectedCountries } = settings;
    return countries.filter(c => selectedCountries.indexOf(c.value) === -1);
  }
);

const getActiveCountries = createSelector(
  [getCountries, getMenuSettings],
  (countries, settings) => {
    if (!countries) return null;
    const { selectedCountries } = settings;
    return countries.filter(c => selectedCountries.indexOf(c.value) > -1);
  }
);

export const getSections = createSelector(
  [getDatasets, getActiveCountries],
  (datasets, countries) =>
    menuSections.map(s => {
      const { slug, subCategories } = s;
      const sectionDatasets =
        datasets &&
        datasets
          .filter(
            d => flatten(d.vocabulary.map(v => v.tags)).indexOf(slug) > -1
          )
          .map(d => {
            const { layer, metadata, vocabulary } = d;
            const appMeta = metadata.find(m => m.application === 'gfw') || {};
            const { info } = appMeta || {};
            const defaultLayer =
              layer &&
              layer.length &&
              (layer.find(
                l => l.applicationConfig && l.applicationConfig.default
              ) ||
                layer[0]);
            const { iso, id } = defaultLayer || {};

            return {
              ...d,
              ...info,
              iso,
              layer: id,
              tags: flatten(vocabulary.map(v => v.tags)),
              ...(defaultLayer && defaultLayer.applicationConfig)
            };
          });
      let subCategoriesWithDatasets = [];
      if (subCategories) {
        subCategoriesWithDatasets = subCategories.map(subCat => ({
          ...subCat,
          datasets: sectionDatasets.filter(
            d => d.tags.indexOf(subCat.slug) > -1 && d.global
          )
        }));
      }
      let countriesWithDatasets = [];
      if (countries) {
        countriesWithDatasets = countries.map(c => ({
          title: c.label,
          slug: c.value,
          datasets: sectionDatasets.filter(
            d => !d.global && d.iso.indexOf(c.value) > -1
          )
        }));
      }

      return {
        ...s,
        datasets: sectionDatasets,
        subCategories: countriesWithDatasets.concat(subCategoriesWithDatasets)
      };
    })
);

export const getSectionsWithData = createSelector(
  [getSections, getLayers],
  (sections, layers) => {
    if (!layers) return sections;
    const datasetIds = layers.map(d => d.dataset);
    return sections.map(s => ({
      ...s,
      layerCount: s.datasets.filter(
        d => layers && datasetIds.indexOf(d.id) > -1
      ).length,
      datasets:
        s.datasets &&
        s.datasets.map(d => ({
          ...d,
          active: datasetIds.indexOf(d.id) > -1
        })),
      subCategories:
        s.subCategories &&
        s.subCategories.map(subCat => ({
          ...subCat,
          datasets:
            subCat.datasets &&
            subCat.datasets.map(d => ({
              ...d,
              active: datasetIds.indexOf(d.id) > -1
            }))
        }))
    }));
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
