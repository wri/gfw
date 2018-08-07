import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';

import treesIcon from 'assets/icons/trees.svg';
import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
import climateBubblesIcon from 'assets/icons/climate-bubbles.svg';
import featherIcon from 'assets/icons/feather.svg';
import searchIcon from 'assets/icons/search.svg';

import { getLayers } from 'components/map/map-selectors';

import Datasets from './components/sections/datasets';
import Explore from './components/sections/explore';

const menuSections = [
  {
    slug: 'forestChange',
    name: 'FOREST CHANGE',
    icon: treesIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'deforestationAlerts',
        title: 'Deforestation Alerts',
        subTitle: '(near real time)'
      },
      {
        slug: 'fireAlerts',
        title: 'Fire Alerts',
        subTitle: '(near real time)'
      },
      {
        slug: 'treeCoverChange',
        title: 'Tree Cover Change'
      }
    ]
  },
  {
    slug: 'landCover',
    name: 'LAND COVER',
    icon: landTreeIcon,
    Component: Datasets
  },
  {
    slug: 'landUse',
    name: 'LAND USE',
    icon: truckIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'concessions',
        title: 'Concessions'
      },
      {
        slug: 'infrastructure',
        title: 'Infrastructure'
      },
      {
        slug: 'people',
        title: 'People'
      }
    ]
  },
  {
    slug: 'climate',
    name: 'CLIMATE',
    icon: climateBubblesIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'carbonDensity',
        title: 'Carbon Density'
      },
      {
        slug: 'carbonEmissions',
        title: 'Carbon Emissions'
      },
      {
        slug: 'carbonGains',
        title: 'Carbon Gains'
      }
    ]
  },
  {
    slug: 'biodiversity',
    name: 'BIODIVERSITY',
    icon: featherIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'conservation',
        title: 'Conservation'
      }
    ]
  },
  {
    slug: 'explore',
    name: 'EXPLORE',
    icon: truckIcon,
    Component: Explore,
    large: true
  },
  {
    slug: 'search',
    name: 'SEARCH',
    icon: searchIcon,
    Component: Datasets
  }
];

const getSelectedSection = state => state.selectedSection || null;
const getDatasets = state => state.datasets || null;
const getLoading = state => state.loading || null;

export const getSections = createSelector(getDatasets, datasets =>
  menuSections.map(s => {
    const sectionDatasets =
      datasets &&
      datasets
        .filter(
          d => flatten(d.vocabulary.map(v => v.tags)).indexOf(s.slug) > -1
        )
        .map(d => {
          const { layer, metadata, vocabulary } = d;
          const appMeta = metadata.find(m => m.application === 'gfw') || {};
          const { info } = appMeta || {};
          return {
            ...d,
            ...info,
            layer:
              layer &&
              layer.length &&
              layer.find(
                l => l.applicationConfig && l.applicationConfig.default
              ).id,
            tags: flatten(vocabulary.map(v => v.tags))
          };
        });
    let subCategoriesWithDatasets = s.subCategories;
    if (subCategoriesWithDatasets) {
      subCategoriesWithDatasets = s.subCategories.map(subCat => ({
        ...subCat,
        datasets: sectionDatasets.filter(d => d.tags.indexOf(subCat.slug) > -1)
      }));
    }
    return {
      ...s,
      datasets: sectionDatasets,
      subCategories: subCategoriesWithDatasets
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
  layers: getLayers,
  loading: getLoading
});
