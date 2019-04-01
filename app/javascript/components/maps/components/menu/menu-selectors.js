import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import flatten from 'lodash/flatten';

import {
  getActiveDatasetsFromState,
  getLayerGroups
} from 'components/maps/map/selectors';
import { getEmbed } from 'components/maps/main-map/selectors';
import { getActive } from 'components/maps/main-map/components/recent-imagery/recent-imagery-selectors';

import { initialState } from './menu-reducers';
import {
  datasetsSections,
  searchSections,
  mobileSections
} from './menu-sections';

const getMenuUrlState = state =>
  state.location && state.location.query && state.location.query.menu;
const getCountries = state => state.countryData && state.countryData.countries;
const getLoading = state =>
  (state.datasets && state.datasets.loading) ||
  (state.countryData && state.countryData.loading);
const getAnalysisLoading = state => state.analysis && state.analysis.loading;
const getDatasets = state => state.datasets && state.datasets.data;
const getLocation = state => state.location && state.location.payload;

// setting from state
export const getMenuSettings = createSelector([getMenuUrlState], urlState => ({
  ...initialState,
  ...urlState
}));

export const getMenuSection = createSelector(
  [getMenuSettings],
  settings => settings.menuSection
);

export const getSelectedCountries = createSelector(
  [getMenuSettings],
  settings => settings.selectedCountries
);

export const getDatasetCategory = createSelector(
  [getMenuSettings],
  settings => settings.datasetCategory
);

export const getSearch = createSelector(
  [getMenuSettings],
  settings => settings.search
);

export const getSearchType = createSelector(
  [getMenuSettings],
  settings => settings.searchType
);

export const getExploreType = createSelector(
  [getMenuSettings],
  settings => settings.exploreType
);

export const getPTWType = createSelector(
  [getMenuSettings],
  settings => settings.ptwType
);

// get countries by datasets
export const getAvailableCountries = createSelector(
  [getCountries, getDatasets],
  (countries, datasets) => {
    if (isEmpty(countries) || isEmpty(datasets)) return null;
    const validIsos = flatten(datasets.filter(d => !d.global).map(d => d.iso));
    return countries.filter(c => validIsos.includes(c.value));
  }
);

export const getUnselectedCountries = createSelector(
  [getAvailableCountries, getSelectedCountries],
  (countries, selectedCountries) => {
    if (!countries) return null;
    return countries.filter(c => !selectedCountries.includes(c.value));
  }
);

export const getActiveCountries = createSelector(
  [getCountries, getSelectedCountries],
  (countries, selectedCountries) => {
    if (!countries) return null;
    return countries.filter(c => selectedCountries.includes(c.value));
  }
);

// build datasets with available countries data
export const getDatasetSections = createSelector(
  [getDatasets, getActiveCountries],
  (datasets, countries) => {
    if (isEmpty(datasets)) return datasetsSections;

    return datasetsSections.map(s => {
      const { category, subCategories } = s;
      const sectionDatasets =
        datasets && datasets.filter(d => d.tags.includes(category));
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

export const getDatasetSectionsWithData = createSelector(
  [
    getDatasetSections,
    getActiveDatasetsFromState,
    getDatasetCategory,
    getMenuSection
  ],
  (sections, activeDatasets, datasetCategory, menuSection) => {
    if (!activeDatasets) return sections;
    const datasetIds = activeDatasets.map(d => d.dataset);

    return sections.map(s => {
      const { datasets, subCategories } = s;
      return {
        ...s,
        active: datasetCategory === s.category && menuSection === s.slug,
        layerCount:
          datasets &&
          datasets.filter(d => activeDatasets && datasetIds.includes(d.id))
            .length,
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

export const getAllSections = createSelector(
  [getDatasetSectionsWithData],
  datasetSections => {
    if (!datasetSections) return null;

    return datasetSections.concat(searchSections).concat(mobileSections);
  }
);

export const getActiveSection = createSelector(
  [getAllSections, getMenuSection, getDatasetCategory],
  (sections, menuSection, datasetCategory) => {
    if (!sections || !menuSection) return null;

    return sections.find(
      s =>
        (s.category
          ? s.category === datasetCategory && s.slug === menuSection
          : s.slug === menuSection)
    );
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

export const getSearchSections = createSelector([getMenuSection], menuSection =>
  searchSections.map(s => ({
    ...s,
    active: menuSection === s.slug
  }))
);

const getLegendLayerGroups = createSelector([getLayerGroups], groups => {
  if (!groups) return null;
  return groups.filter(g => !g.isBoundary && !g.isRecentImagery);
});

export const getMobileSections = createSelector(
  [getMenuSection, getLegendLayerGroups, getLocation, getEmbed],
  (menuSection, activeDatasets, location, embed) =>
    mobileSections.filter(s => !embed || s.embed).map(s => ({
      ...s,
      ...(s.slug === 'datasets' && {
        layerCount: activeDatasets && activeDatasets.length
      }),
      ...(s.slug === 'analysis' && {
        highlight: location && !!location.type && !!location.adm0
      }),
      active: menuSection === s.slug
    }))
);

export const getDatasetCategories = createSelector(
  [getDatasetSectionsWithData],
  datasets =>
    datasets &&
    datasets.map(s => ({
      ...s,
      label: startCase(s.category)
    }))
);

export const getMenuProps = createStructuredSelector({
  datasetSections: getDatasetSectionsWithData,
  searchSections: getSearchSections,
  mobileSections: getMobileSections,
  activeSection: getActiveSectionWithData,
  menuSection: getMenuSection,
  countriesWithoutData: getZeroDataCountries,
  countries: getUnselectedCountries,
  selectedCountries: getActiveCountries,
  activeDatasets: getActiveDatasetsFromState,
  datasetCategory: getDatasetCategory,
  datasetCategories: getDatasetCategories,
  exploreType: getExploreType,
  ptwType: getPTWType,
  search: getSearch,
  searchType: getSearchType,
  location: getLocation,
  loading: getLoading,
  analysisLoading: getAnalysisLoading,
  recentActive: getActive
});
