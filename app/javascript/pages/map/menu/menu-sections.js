import treesIcon from 'assets/icons/trees.svg';
import landTreeIcon from 'assets/icons/land-tree.svg';
import truckIcon from 'assets/icons/truck.svg';
import climateBubblesIcon from 'assets/icons/climate-bubbles.svg';
import featherIcon from 'assets/icons/feather.svg';
import searchIcon from 'assets/icons/search.svg';

import Datasets from './components/sections/datasets';
import Explore from './components/sections/explore';

export default [
  {
    slug: 'forestChange',
    name: 'FOREST CHANGE',
    icon: treesIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'deforestationAlerts',
        title: 'Deforestation Alerts',
        subTitle: 'near real time'
      },
      {
        slug: 'fireAlerts',
        title: 'Fire Alerts',
        subTitle: 'near real time'
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
    large: true,
    section: 'topics'
  },
  {
    slug: 'search',
    name: 'SEARCH',
    icon: searchIcon
  }
];
