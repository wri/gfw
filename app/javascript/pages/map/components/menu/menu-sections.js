import forestChange from 'assets/icons/forest-change.svg';
import landCover from 'assets/icons/land-cover.svg';
import landUse from 'assets/icons/land-use.svg';
import climate from 'assets/icons/climate.svg';
import biodiversity from 'assets/icons/biodiversity.svg';
import explore from 'assets/icons/explore.svg';
import layers from 'assets/icons/layers.svg';
import data from 'assets/icons/globe.svg';
import analysis from 'assets/icons/analysis.svg';
import searchIcon from 'assets/icons/search.svg';

import Analysis from 'components/map-v2/components/analysis';
import Legend from 'components/map-v2/components/legend';
import Datasets from './components/sections/datasets';
import Explore from './components/sections/explore';
import Search from './components/sections/search';

export const mobileSections = [
  {
    slug: 'layers',
    name: 'LAYERS',
    icon: data,
    Component: Datasets
  },
  {
    slug: 'data',
    name: 'DATA',
    icon: layers,
    Component: Legend
  },
  {
    slug: 'analysis',
    name: 'ANALYSIS',
    icon: analysis,
    Component: Analysis
  },
  {
    slug: 'explore',
    name: 'EXPLORE',
    icon: explore,
    Component: Explore
  },
  {
    slug: 'search',
    name: 'SEARCH',
    icon: searchIcon,
    Component: Search
  }
];

export const searchSections = [
  {
    slug: 'explore',
    name: 'EXPLORE',
    icon: explore,
    Component: Explore,
    large: true,
    section: 'topics'
  },
  {
    slug: 'search',
    name: 'SEARCH',
    icon: searchIcon,
    Component: Search
  }
];

export const datasetsSections = [
  {
    slug: 'layers',
    category: 'forestChange',
    title: 'LAYERS',
    name: 'FOREST CHANGE',
    icon: forestChange,
    Component: Datasets,
    subCategories: [
      {
        slug: 'deforestationAlerts',
        title: 'Deforestation Alerts'
      },
      {
        slug: 'fireAlerts',
        title: 'Fire Alerts'
      },
      {
        slug: 'treeCoverChange',
        title: 'Tree Cover Change'
      }
    ]
  },
  {
    slug: 'layers',
    category: 'landCover',
    title: 'LAYERS',
    name: 'LAND COVER',
    icon: landCover,
    Component: Datasets,
    subCategories: [
      {
        slug: 'landCover',
        title: 'Land Cover'
      }
    ]
  },
  {
    slug: 'layers',
    category: 'landUse',
    title: 'LAYERS',
    name: 'LAND USE',
    icon: landUse,
    Component: Datasets,
    subCategories: [
      {
        slug: 'concessions',
        title: 'Commodities'
      },
      {
        slug: 'conservation',
        title: 'Conservation'
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
    slug: 'layers',
    category: 'climate',
    title: 'LAYERS',
    name: 'CLIMATE',
    icon: climate,
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
    slug: 'layers',
    category: 'biodiversity',
    title: 'LAYERS',
    name: 'BIODIVERSITY',
    icon: biodiversity,
    Component: Datasets,
    subCategories: [
      {
        slug: 'conservation',
        title: 'Conservation'
      }
    ]
  }
];
