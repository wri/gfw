import forestChangeIcon from 'assets/icons/forest-change.svg';
import landCoverIcon from 'assets/icons/land-cover.svg';
import landUseIcon from 'assets/icons/land-use.svg';
import climateIcon from 'assets/icons/climate.svg';
import biodiversityIcon from 'assets/icons/biodiversity.svg';
import exploreIcon from 'assets/icons/explore.svg';
import layersIcon from 'assets/icons/layers.svg';
import globeIcon from 'assets/icons/globe.svg';
import analysisIcon from 'assets/icons/analysis.svg';
import searchIcon from 'assets/icons/search.svg';

import RecentImagerySettings from 'components/map-v2/components/recent-imagery/components/recent-imagery-settings';
import Basemaps from 'components/map-v2/components/basemaps';
import Analysis from 'components/map-v2/components/analysis';
import Legend from 'components/map-v2/components/legend';
import Datasets from './components/sections/datasets';
import Explore from './components/sections/explore';
import Search from './components/sections/search';

export const mobileSections = [
  {
    label: 'layers',
    slug: 'datasets',
    icon: globeIcon,
    Component: Datasets
  },
  {
    label: 'legend',
    slug: 'legend',
    icon: layersIcon,
    Component: Legend,
    embed: true
  },
  {
    label: 'analysis',
    slug: 'analysis',
    icon: analysisIcon,
    Component: Analysis,
    embed: true
  },
  {
    label: 'explore',
    slug: 'explore',
    icon: exploreIcon,
    Component: Explore
  },
  {
    label: 'search',
    slug: 'search',
    icon: searchIcon,
    Component: Search
  },
  {
    label: 'Recent Imagery',
    slug: 'recent-imagery',
    icon: searchIcon,
    Component: RecentImagerySettings,
    hidden: true
  }
];

export const searchSections = [
  {
    label: 'explore',
    slug: 'explore',
    icon: exploreIcon,
    Component: Explore,
    large: true
  },
  {
    label: 'search',
    slug: 'search',
    icon: searchIcon,
    Component: Search
  }
];

export const datasetsSections = [
  {
    label: 'layers',
    slug: 'datasets',
    category: 'forestChange',
    icon: forestChangeIcon,
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
    label: 'layers',
    slug: 'datasets',
    category: 'landCover',
    icon: landCoverIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'landCover',
        title: 'Land Cover'
      }
    ]
  },
  {
    label: 'layers',
    slug: 'datasets',
    category: 'landUse',
    icon: landUseIcon,
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
    label: 'layers',
    slug: 'datasets',
    category: 'climate',
    icon: climateIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'carbonEmissions',
        title: 'Carbon Emissions'
      },
      {
        slug: 'carbonDensity',
        title: 'Carbon Density'
      },
      {
        slug: 'carbonGains',
        title: 'Carbon Gains'
      }
    ]
  },
  {
    label: 'layers',
    slug: 'datasets',
    category: 'biodiversity',
    icon: biodiversityIcon,
    Component: Datasets,
    subCategories: [
      {
        slug: 'conservation',
        title: 'Conservation'
      }
    ]
  },
  {
    label: 'layers',
    slug: 'datasets',
    category: 'basemaps',
    icon: globeIcon,
    Component: Basemaps,
    hiddenMobile: true
  }
];
