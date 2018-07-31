import { createSelector, createStructuredSelector } from 'reselect';

import treesIcon from 'assets/icons/trees.svg';
import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
import climateBubblesIcon from 'assets/icons/climate-bubbles.svg';
import featherIcon from 'assets/icons/feather.svg';
import worldIcon from 'assets/icons/world.svg';
import searchIcon from 'assets/icons/search.svg';
import { getLayers } from 'components/map/map-selectors';

import ForestChange from './components/sections/forest-change';
import Countries from './components/sections/countries';
import Explore from './components/sections/explore';

const menuSections = [
  {
    slug: 'forestChange',
    name: 'FOREST CHANGE',
    icon: treesIcon,
    Component: ForestChange
  },
  {
    slug: 'landCover',
    name: 'LAND COVER',
    icon: landTreeIcon,
    Component: ForestChange
  },
  {
    slug: 'landUse',
    name: 'LAND USE',
    icon: truckIcon,
    Component: ForestChange
  },
  {
    slug: 'climate',
    name: 'CLIMATE',
    icon: climateBubblesIcon,
    Component: ForestChange
  },
  {
    slug: 'biodiversity',
    name: 'BIODIVERSITY',
    icon: featherIcon,
    Component: ForestChange
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
    Component: ForestChange
  }
];

const getSelectedSection = state => state.selectedSection || null;
const getDatasets = state => state.datasets || null;

export const getSections = createSelector(getDatasets, datasets =>
  menuSections.map(s => ({
    ...s,
    datasets: datasets && datasets
      .filter(d => d.vocabulary && d.vocabulary.length && d.vocabulary[0].tags.indexOf(s.slug) > -1)
      .map(d => {
        const metadata = d.metadata && d.metadata.length && d.metadata[0];
        const { name, source } = metadata;
        return {
          name: name || d.name,
          description: source,
          id: d.id,
          layer: d.layer && d.layer.length && d.layer[0].id
        };
      })
  }))
);

export const getSectionsWithCount = createSelector(
  [getSections, getLayers],
  (sections, layers) => {
    if (!layers) return sections;
    return sections.map(s => ({
      ...s,
      layerCount: s.datasets.filter(d => layers && layers.map(l => l.dataset).indexOf(d.id) > -1).length
    }));
  }
);

export const getActiveSection = createSelector(
  [getSectionsWithCount, getSelectedSection],
  (sections, selectedSection) => {
    if (!sections || !selectedSection) return null;

    return sections.find(s => s.slug === selectedSection);
  }
);

export const getMenuProps = createStructuredSelector({
  sections: getSectionsWithCount,
  activeSection: getActiveSection
});
