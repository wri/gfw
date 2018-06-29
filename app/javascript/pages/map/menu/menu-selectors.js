import { createSelector } from 'reselect';

import treesIcon from 'assets/icons/trees.svg';
import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
import climateBubblesIcon from 'assets/icons/climate-bubbles.svg';
import featherIcon from 'assets/icons/feather.svg';
import worldIcon from 'assets/icons/world.svg';
import searchIcon from 'assets/icons/search.svg';

import ForestChange from './components/sections/forest-change';
import Countries from './components/sections/countries';
import Explore from './components/sections/explore';

const getSelectedSection = state => state.selectedSection || null;

export const getSections = createSelector([], () => ({
  'forest-change': {
    name: 'FOREST CHANGE',
    icon: treesIcon,
    Component: ForestChange
  },
  'land-cover': {
    name: 'LAND COVER',
    icon: landTreeIcon,
    Component: ForestChange
  },
  'land-use': {
    name: 'LAND USE',
    icon: truckIcon,
    Component: ForestChange
  },
  climate: {
    name: 'CLIMATE',
    icon: climateBubblesIcon,
    Component: ForestChange
  },
  biodiversity: {
    name: 'BIODIVERSITY',
    icon: featherIcon,
    Component: ForestChange
  },
  countries: {
    name: 'COUNTRIES',
    icon: worldIcon,
    Component: Countries
  },
  explore: {
    name: 'EXPLORE',
    icon: truckIcon,
    Component: Explore,
    bigFlap: true
  },
  search: {
    name: 'SEARCH',
    icon: searchIcon,
    Component: ForestChange
  }
}));

export const getSectionData = createSelector(
  [getSections, getSelectedSection],
  (sections, selectedSection) => {
    if (!sections || !selectedSection) return null;

    return sections[selectedSection];
  }
);
