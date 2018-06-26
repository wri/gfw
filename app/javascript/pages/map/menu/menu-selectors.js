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

const getSelectedSection = state => state.selectedSection || null;
const getCountries = state => state.countries || null;

export const getSections = createSelector([], () => ({
  'forest-change': {
    name: 'FOREST CHANGE',
    icon: treesIcon,
    Component: ForestChange,
    data: [
      {
        name: 'DEFORESTATION ALERTS',
        description: '(near real-time)',
        layers: [
          {
            name: 'GLAD alerts',
            description: '(weekly, 30m, select countries, UMD/GLAD)',
            slugs: ['umd_as_it_happens', 'places_to_watch'],
            meta: 'umd_landsat_alerts'
          },
          {
            name: 'FORMA alerts',
            description: '(daily, 250m, tropics, WRI/Google)',
            slugs: ['forma_month_3'],
            meta: 'forma_250_alerts'
          }
        ]
      },
      {
        layers: [
          {
            name: 'VIIRS active fires',
            description: '(daily, 375m, global, NASA)',
            slugs: ['forma_month_3'],
            meta: 'forma_250_alerts'
          }
        ]
      },
      {
        name: 'TREE COVER CHANGE',
        layers: [
          {
            name: 'Tree cover loss',
            description: '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
            slugs: ['forma_month_3'],
            meta: 'forma_250_alerts'
          },
          {
            name: 'Tree cover gain',
            description: '(12 years, 30m, global, Hansen/UMD/Google/USGS/NASA)',
            slugs: ['forma_month_3'],
            meta: 'forma_250_alerts'
          },
          {
            name: 'Peru MINAM tree cover loss',
            slugs: ['forma_month_3'],
            meta: 'forma_250_alerts'
          }
        ]
      }
    ]
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
    Component: ForestChange,
    bigFlap: true
  },
  search: {
    name: 'SEARCH',
    icon: searchIcon,
    Component: ForestChange
  }
}));

export const getCountriesData = createSelector([getCountries], () => [
  {
    name: 'SELECT COUNTRY',
    layers: [
      {
        name: 'Brazil land cover',
        description: '(2000-2016, MapBiomas)',
        slugs: ['umd_as_it_happens', 'places_to_watch'],
        meta: 'umd_landsat_alerts'
      },
      {
        name: 'Brazil biomes',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      },
      {
        name: 'Brazil indigenous lands',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      }
    ]
  },
  {
    text:
      'User from <b>Brazil</b>? <a href="#">Add your own data</a> to the Global Forest Watch interactive map.'
  }
]);

export const getSectionData = createSelector(
  [getSections, getSelectedSection, getCountriesData],
  (sections, selectedSection, countries) => {
    if (!sections || !selectedSection) return null;

    const section = sections[selectedSection];
    if (selectedSection === 'countries') {
      section.data = countries;
    }

    return section;
  }
);
