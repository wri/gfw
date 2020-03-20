import climate from 'assets/images/climate.jpg';
import biodiversity from 'assets/images/biodiversity.jpg';
import water from 'assets/images/water.jpg';
import commodities from 'assets/images/commodities.jpg';
import mongabay from 'assets/images/mongabay.jpg';
import earthJournalism from 'assets/images/earth-journalism.jpg';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
  FOREST_LOSS_DATASET,
  FOREST_EXTENT_DATASET,
  RIVER_BASINS_BOUNDARIES_DATASET,
  BIOMASS_LOSS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
  FOREST_LOSS,
  FOREST_EXTENT,
  RIVER_BASINS_BOUNDARIES,
  BIOMASS_LOSS
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
        extLink: '/stories'
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
            dataset: 'd7b12b17-9ed4-43ab-b8e4-efa2668c47f8',
            layers: ['e097ebfe-56d9-4564-8e2a-d3328bdaea38'],
            opacity: 1,
            visibility: true
          }
        ]
      }
    }
  },
  earthJournalism: {
    slug: 'earth-journalism',
    title: 'Earth Journalism Network Stories',
    summary:
      'This layer displays stories sourced from the Earth Journalism Network, a project of Internews that empowers and enables journalists from developing countries to cover the environment more effectively.',
    image: earthJournalism,
    buttons: [
      {
        text: 'READ MORE',
        theme: 'theme-button-light theme-button-small',
        extLink: '/stories'
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
            dataset: 'd7b12b17-9ed4-43ab-b8e4-efa2668c47f8',
            layers: ['2f4d9b87-6629-4658-8175-87d7892a5f32'],
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
        extLink: '/topics/biodiversity'
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
            dataset: 'a684a9bb-63f2-4bea-bf62-fd5e80d23d75',
            layers: ['dfd9deb6-8d39-4640-8571-4389d5d8898a'],
            opacity: 1,
            visibility: true
          },
          // biodiversity intactness
          {
            dataset: '6a1afe78-0813-45c4-822f-b52fe10f93f2',
            layers: ['647998c2-cdf6-43fd-bbff-15358f111fe9'],
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
        extLink: '/topics/climate'
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
        extLink: '/topics/commodities'
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
            dataset: '7a4d9a64-ecb1-45ec-a01e-658f1364fb2e',
            layers: ['fcd10026-e892-4fb8-8d79-8d76e3b94005'],
            opacity: 1,
            visibility: true
          },
          // managed forests
          {
            dataset: '4fc24a03-cb3e-4df3-a2ee-e2a8dca342b3',
            layers: ['c26db41a-b586-461c-b648-93205eafea0b'],
            opacity: 1,
            visibility: true
          },
          // oil palm
          {
            dataset: 'c5aac280-9dac-4e97-8f44-afc52a52c255',
            layers: ['aef0a3e5-729e-4f1a-9b1c-25a73c7ea4c1'],
            opacity: 1,
            visibility: true
          },
          // wood fiber
          {
            dataset: '1f016faa-5940-4dd3-a848-a00086e20e38',
            layers: ['82229960-13c2-4810-84e7-bdd4812d4578'],
            opacity: 1,
            visibility: true
          },
          // loss
          {
            dataset: FOREST_LOSS_DATASET,
            layers: [FOREST_LOSS],
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
        extLink: '/topics/water'
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
  }
};
