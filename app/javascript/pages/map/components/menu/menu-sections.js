import forestChange from 'assets/icons/forest-change.svg';
import landCover from 'assets/icons/land-cover.svg';
import landUse from 'assets/icons/land-use.svg';
import climate from 'assets/icons/climate.svg';
import biodiversity from 'assets/icons/biodiversity.svg';
import explore from 'assets/icons/explore.svg';
import searchIcon from 'assets/icons/search.svg';

import Datasets from './components/sections/datasets';
import Explore from './components/sections/explore';

export const bottomSections = [
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
    icon: searchIcon
  }
];

export default [
  {
    slug: 'forestChange',
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
    slug: 'landCover',
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
    slug: 'landUse',
    name: 'LAND USE',
    icon: landUse,
    Component: Datasets,
    subCategories: [
      {
        slug: 'concessions',
        title: 'Commodities'
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
    slug: 'biodiversity',
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
