import { createSelector, createStructuredSelector } from 'reselect';
import flatten from 'lodash/flatten';

import treesIcon from 'assets/icons/trees.svg';
import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
import climateBubblesIcon from 'assets/icons/climate-bubbles.svg';
import featherIcon from 'assets/icons/feather.svg';
import worldIcon from 'assets/icons/world.svg';
import searchIcon from 'assets/icons/search.svg';

import { getLayers } from 'components/map/map-selectors';

import Datasets from './components/sections/datasets';
import Countries from './components/sections/countries';
import Explore from './components/sections/explore';

const menuSections = [
  {
    slug: 'forestChange',
    name: 'FOREST CHANGE',
    icon: treesIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'forestChange',
        title: 'Deforestation Alerts',
        subTitle: '(near real time)'
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
    Component: Datasets
  },
  {
    slug: 'climate',
    name: 'CLIMATE',
    icon: climateBubblesIcon,
    Component: Datasets
  },
  {
    slug: 'biodiversity',
    name: 'BIODIVERSITY',
    icon: featherIcon,
    Component: Datasets
  },
  {
    slug: 'countries',
    name: 'COUNTRIES',
    icon: worldIcon,
    Component: Countries
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

export const getSections = createSelector(getDatasets, datasets =>
  menuSections.map(s => {
    const sectionDatasets =
      datasets &&
      datasets
        .filter(
          d => flatten(d.vocabulary.map(v => v.tags)).indexOf(s.slug) > -1
        )
        .map(d => {
          const metadata = d.metadata && d.metadata.length && d.metadata[0];
          const { name, source } = metadata;
          return {
            name: name || d.name,
            description: source,
            id: d.id,
            layer: d.layer && d.layer.length && d.layer[0].id,
            tags: flatten(d.vocabulary.map(v => v.tags))
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
  layers: getLayers
});
