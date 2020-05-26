import climate from 'assets/images/climate.jpg';
import biodiversity from 'assets/images/biodiversity.jpg';
import water from 'assets/images/water.jpg';
import fires from 'assets/images/fires.jpg';
import commodities from 'assets/images/commodities.jpg';
import mongabay from 'assets/images/mongabay.jpg';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
  FOREST_LOSS_DATASET,
  FOREST_EXTENT_DATASET,
  RIVER_BASINS_BOUNDARIES_DATASET,
  BIOMASS_LOSS_DATASET,
  BIODIVERSITY_HOTSPOTS_2016_DATASET,
  BIODIVERSITY_INTACTNESS_2016_DATASET,
  GFW_STORIES_DATASET,
  MINING_CONCESSIONS_DATASET,
  RSPO_OIL_PALM_CONCESSIONS_DATASET,
  WOOD_FIBER_DATASET,
  OIL_PALM_DATASET,
  LOGGING_CONCESSIONS_DATASET,
  FIRES_VIIRS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
  FOREST_LOSS,
  FOREST_EXTENT,
  RIVER_BASINS_BOUNDARIES,
  BIOMASS_LOSS,
  BIODIVERSITY_HOTSPOTS_2016,
  BIODIVERSITY_INTACTNESS,
  MONGABAY_STORIES,
  MINING_CONCESSIONS,
  RSPO_OIL_PALM_CONCESSIONS_2017,
  WOOD_FIBER,
  OIL_PALM,
  LOGGING_CONCESSIONS,
  FIRES_ALERTS_VIIRS
} from 'data/layers';

export const descriptions = {
  topics: 'Explore data related to the drivers and impacts of forest change.',
  placesToWatch:
    'Explore areas of recent forest loss that pose the biggest threat to the world’s remaining forests. Updated monthly. Sign up <a href="http://connect.wri.org/l/120942/2017-12-07/3mtt5w" target="_blank" rel="noopener nofollower">here</a> to receive an email when new Places to Watch are identified.'
};

export const stories = {
  monga: {
    slug: 'monga',
    title: 'Mongabay stories',
    summary:
      'This layer displays stories from Mongabay, a leading environmental science and conservation news website.',
    image: mongabay,
    buttons: [
      {
        text: 'READ MORE',
        theme: 'theme-button-light theme-button-small',
        link: '/stories'
      },
      {
        text: 'VIEW ON MAP',
        theme: 'theme-button-small'
      }
    ],
    payload: {
      mergeQuery: true,
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 2,
        datasets: [
          // admin boundaries
          {
            dataset: POLITICAL_BOUNDARIES_DATASET,
            layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
            opacity: 1,
            visibility: true
          },
          {
            dataset: GFW_STORIES_DATASET,
            layers: [MONGABAY_STORIES],
            opacity: 1,
            visibility: true
          }
        ]
      }
    }
  }
};

export const topics = {
  biodiversity: {
    slug: 'biodiversity',
    title: 'Biodiversity',
    summary: 'View the areas most important to terrestrial biodiversity.',
    image: biodiversity,
    buttons: [
      {
        text: 'view topic',
        theme: 'theme-button-small theme-button-light',
        link: '/topics/biodiversity'
      },
      {
        text: 'VIEW ON MAP',
        theme: 'theme-button-small'
      }
    ],
    payload: {
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 2,
        datasets: [
          // admin boundaries
          {
            dataset: POLITICAL_BOUNDARIES_DATASET,
            layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
            opacity: 1,
            visibility: true
          },
          // biodiversity hotspots
          {
            dataset: BIODIVERSITY_HOTSPOTS_2016_DATASET,
            layers: [BIODIVERSITY_HOTSPOTS_2016],
            opacity: 1,
            visibility: true
          },
          // biodiversity intactness
          {
            dataset: BIODIVERSITY_INTACTNESS_2016_DATASET,
            layers: [BIODIVERSITY_INTACTNESS],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: {
          value: 'default'
        },
        label: 'default'
      }
    }
  },
  climate: {
    slug: 'climate',
    title: 'Climate',
    summary: 'View emissions from tree cover loss in the tropics.',
    image: climate,
    buttons: [
      {
        text: 'view topic',
        theme: 'theme-button-small theme-button-light',
        link: '/topics/climate'
      },
      {
        text: 'VIEW ON MAP',
        theme: 'theme-button-small'
      }
    ],
    payload: {
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 2,
        datasets: [
          // admin boundaries
          {
            dataset: POLITICAL_BOUNDARIES_DATASET,
            layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
            opacity: 1,
            visibility: true
          },
          // biomass loss
          {
            dataset: BIOMASS_LOSS_DATASET,
            layers: [BIOMASS_LOSS],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: {
          value: 'dark'
        },
        label: 'lightLabels'
      },
      mainMap: {
        showAnalysis: true
      }
    }
  },
  commodities: {
    slug: 'commodities',
    title: 'Commodities',
    summary:
      'View tree cover loss within areas allocated for commodity production.',
    image: commodities,
    buttons: [
      {
        text: 'view topic',
        theme: 'theme-button-small theme-button-light',
        link: '/topics/commodities'
      },
      {
        text: 'VIEW ON MAP',
        theme: 'theme-button-small'
      }
    ],
    payload: {
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 2,
        datasets: [
          // admin boundaries
          {
            dataset: POLITICAL_BOUNDARIES_DATASET,
            layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
            opacity: 1,
            visibility: true
          },
          // mining
          {
            dataset: MINING_CONCESSIONS_DATASET,
            layers: [MINING_CONCESSIONS],
            opacity: 1,
            visibility: true
          },
          // managed forests
          {
            dataset: LOGGING_CONCESSIONS_DATASET,
            layers: [LOGGING_CONCESSIONS],
            opacity: 1,
            visibility: true
          },
          // oil palm
          {
            dataset: OIL_PALM_DATASET,
            layers: [OIL_PALM],
            opacity: 1,
            visibility: true
          },
          // wood fiber
          {
            dataset: WOOD_FIBER_DATASET,
            layers: [WOOD_FIBER],
            opacity: 1,
            visibility: true
          },
          // loss
          {
            dataset: FOREST_LOSS_DATASET,
            layers: [FOREST_LOSS],
            opacity: 1,
            visibility: true
          },
          // rspo oil palm concessions
          {
            dataset: RSPO_OIL_PALM_CONCESSIONS_DATASET,
            layers: [RSPO_OIL_PALM_CONCESSIONS_2017],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: {
          value: 'default'
        },
        label: 'default'
      }
    }
  },
  water: {
    slug: 'water',
    title: 'Water',
    summary: 'Explore forest change in each major river basin.',
    image: water,
    buttons: [
      {
        text: 'view topic',
        theme: 'theme-button-small theme-button-light',
        link: '/topics/water'
      },
      {
        text: 'VIEW ON MAP',
        theme: 'theme-button-small'
      }
    ],
    payload: {
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 2,
        datasets: [
          // admin boundaries
          {
            dataset: RIVER_BASINS_BOUNDARIES_DATASET,
            layers: [RIVER_BASINS_BOUNDARIES],
            opacity: 1,
            visibility: true
          },
          // gain
          {
            dataset: FOREST_GAIN_DATASET,
            layers: [FOREST_GAIN],
            opacity: 1,
            visibility: true
          },
          // loss
          {
            dataset: FOREST_LOSS_DATASET,
            layers: [FOREST_LOSS],
            opacity: 1,
            visibility: true
          },
          // extent
          {
            dataset: FOREST_EXTENT_DATASET,
            layers: [FOREST_EXTENT],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: {
          value: 'default'
        },
        label: 'default'
      }
    }
  },
  fires: {
    slug: 'fires',
    title: 'Fires',
    summary: 'View fire alerts within an area of interest.',
    image: fires,
    buttons: [
      {
        text: 'view topic',
        theme: 'theme-button-small theme-button-light',
        link: '/topics/fires'
      },
      {
        text: 'VIEW ON MAP',
        theme: 'theme-button-small'
      }
    ],
    payload: {
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 2,
        datasets: [
          {
            dataset: FIRES_VIIRS_DATASET,
            layers: [FIRES_ALERTS_VIIRS],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: {
          value: 'default'
        },
        label: 'default'
      },
      mainMap: {
        menuSection: 'my-gfw'
      }
    }
  }
};
