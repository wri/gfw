import climate from 'assets/images/climate.jpg';
import biodiversity from 'assets/images/biodiversity.jpg';
import water from 'assets/images/water.jpg';
import commodities from 'assets/images/commodities.jpg';
import userStories from 'assets/images/user-stories.jpg';
import mongabay from 'assets/images/mongabay.jpg';
import earthJournalism from 'assets/images/earth-journalism.jpg';

import basemaps, {
  labels
} from 'components/map-v2/components/basemaps/basemaps-schema';

export const descriptions = {
  topics:
    'Topics are curated map presets for exploring the drivers of deforestation and understanding their impacts in ecosystems around the world.',
  placesToWatch:
    'A GFW service that identifies areas of high-priority GLAD alerts on a monthly basis.',
  stories:
    'Explore stories ralated to conservation from our users and other journalism sources.'
};

export const stories = {
  user: {
    slug: 'user',
    title: 'User stories',
    summary: 'Stories submitted by GFW users.',
    image: userStories,
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
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 3,
        datasets: [
          // admin boundaries
          {
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
            opacity: 1,
            visibility: true
          }
        ]
      }
    }
  },
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
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 3,
        datasets: [
          // admin boundaries
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
      map: {
        center: {
          lat: 27,
          lng: 12
        },
        zoom: 3,
        datasets: [
          // admin boundaries
          {
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
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
    summary:
      'Protecting forest habitats is key to maintaining biodiversity. In the last ten years, one in ten trees were lost in protected areas.',
    image: biodiversity,
    buttons: [
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
        zoom: 3,
        datasets: [
          // admin boundaries
          {
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
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
            dataset: 'fee5fc38-7a62-49b8-8874-dfa31cbb1ef6',
            layers: ['43a205fe-aad3-4db1-8807-c399a3264349'],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: basemaps.default,
        label: labels.default
      }
    }
  },
  climate: {
    slug: 'climate',
    title: 'Climate',
    summary:
      'Forests remove carbon from the atmosphere, their loss or degradation compromises their ability to remove our ever-increasing emissions.',
    image: climate,
    buttons: [
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
        zoom: 3,
        datasets: [
          // admin boundaries
          {
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
            opacity: 1,
            visibility: true
          },
          // biomass loss
          {
            dataset: 'a9cc6ec0-5c1c-4e36-9b26-b4ee0b50587b',
            layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe'],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: basemaps.dark,
        label: labels.lightLabels
      },
      analysis: {
        showAnalysis: true
      }
    }
  },
  commodities: {
    slug: 'commodities',
    title: 'Commodities',
    summary:
      'To assist in increasing supply-chain transparency, our platform lets users track deforestation and estimate production over time in concession areas.',
    image: commodities,
    buttons: [
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
        zoom: 3,
        datasets: [
          // admin boundaries
          {
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
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
            dataset: 'c4d4e07c-c5b4-4e2c-9db1-5c3bec185f0e',
            layers: ['0911abc4-d861-4d7a-84d6-0fa07b51d7d8'],
            opacity: 1,
            visibility: true
          },
          // wood fiber
          {
            dataset: '93e67a77-1a31-4d04-a75d-86a4d6e35d54',
            layers: ['557dc2cf-0ba7-4410-813c-99d692725fe7'],
            opacity: 1,
            visibility: true
          },
          // loss
          {
            dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
            layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: basemaps.default,
        label: labels.default
      }
    }
  },
  water: {
    slug: 'water',
    title: 'Water',
    summary:
      'Healthy forested lands provide critical watershed functions, acting as natural infrastructure by minimizing erosion, purifying water, and reducing the impact of floods and droughts.',
    image: water,
    buttons: [
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
        zoom: 3,
        datasets: [
          // admin boundaries
          {
            dataset: '63295b05-55a1-456c-a56c-c9ccb3a711ec',
            layers: ['d590f83c-9b54-4542-8d27-f61b8b19df46'],
            opacity: 1,
            visibility: true
          },
          // gain
          {
            dataset: '70e2549c-d722-44a6-a8d7-4a385d78565e',
            layers: ['3b22a574-2507-4b4a-a247-80057c1a1ad4'],
            opacity: 1,
            visibility: true
          },
          // loss
          {
            dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
            layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
            opacity: 1,
            visibility: true
          },
          // extent
          {
            dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
            layers: ['78747ea1-34a9-4aa7-b099-bdb8948200f4'],
            opacity: 1,
            visibility: true
          }
        ],
        basemap: basemaps.default,
        label: labels.default
      }
    }
  }
};
