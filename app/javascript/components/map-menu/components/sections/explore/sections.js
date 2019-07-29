import climate from 'assets/images/climate.jpg';
import biodiversity from 'assets/images/biodiversity.jpg';
import water from 'assets/images/water.jpg';
import commodities from 'assets/images/commodities.jpg';
import mongabay from 'assets/images/mongabay.jpg';
import earthJournalism from 'assets/images/earth-journalism.jpg';

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
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
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
            dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
            layers: [
              '6f6798e6-39ec-4163-979e-182a74ca65ee',
              'c5d1e010-383a-4713-9aaa-44f728c0571c'
            ],
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
            layers: ['f680828e-be68-4895-b1ed-1d0915d07457'],
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
        basemap: {
          value: 'default'
        },
        label: 'default'
      }
    }
  }
};
