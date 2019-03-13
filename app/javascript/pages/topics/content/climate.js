import monitorImage from 'pages/topics/assets/climate/cards/monitor.png';
import exploreImage from 'pages/topics/assets/climate/cards/explore.png';
import carbonImage from 'pages/topics/assets/climate/cards/carbon.png';
import calculateImage from 'pages/topics/assets/climate/cards/calculate.png';
import insightsImage from 'pages/topics/assets/climate/cards/insights.png';
import researchImage from 'pages/topics/assets/climate/cards/research.png';
import climate from 'pages/topics/assets/climate/climate-leaf.svg';

export default {
  intro: {
    img: climate,
    title:
      'Forests can provide 30% of the solution to keeping global warming below 2°C.',
    text:
      'Forests remove and store carbon from the atmosphere, representing cost-effective solution for mitigating climate change. The loss or degredation of forests compromises their ability to remove emissions.'
  },
  slides: [
    {
      title: 'Climate',
      subtitle: 'Pristine state',
      text:
        'Forests provide a natural solution for removing carbon from the atmosphere. Forests absorb and store carbon emissions caused by human activity, like burning fossil fuels, thus helping to remove harmful emissions from within the atmosphere and ocean.',
      src: 'climate1'
    },
    {
      title: 'Climate',
      subtitle: 'Drivers of change',
      text:
        'Forests ability to absorb carbon from the atmosphere can be compromised by commodity production, urbanization, disease and fires that cause forest loss. When a tree burns or decays, it emits the carbon it was storing into the atmosphere, futher exacerbating climate change.',
      src: 'climate2'
    },
    {
      title: 'Climate',
      subtitle: 'Compromised state',
      text:
        'With fewer trees to help absorb and regulate carbon in the atmopshere, the Earths temperate rises and the effects of climate change increase.',
      src: 'climate3'
    },
    {
      title: 'Climate',
      subtitle: 'Recovery state',
      text:
        'Sustainable forest management, improved land tenure, conservation, performance-based financing and restoration are all valuable strategies for preserving forests as a natural climate solution. These solutions also have positive economic, biodiversity, and societal impacts. Improvements in forest monitoring data and technology faciliate implementation of these solutions.',
      src: 'climate4'
    }
  ],
  cards: [
    {
      id: 'carbon',
      title: 'View carbon and emissions statistics',
      summary:
        'Find answers to questions about carbon and emissions globally, by country or even subnationally.',
      extLink: 'http://bit.ly/2TeK815',
      image: carbonImage,
      btnText: 'view data'
    },
    {
      id: 'monitor',
      title: 'Monitor progress in real time',
      summary:
        'The political will to reduce tropical deforestation has never been higher. Are countries on track to meet commitments? Track progress in near-real time with weekly deforestation alerts - just select a country',
      extLink: 'http://bit.ly/2TeK815',
      image: monitorImage,
      btnText: 'view data'
    },
    {
      id: 'explore',
      title: 'Explore data on the map',
      summary: 'View biomass density and loss, emissions and more.',
      extLink: 'http://bit.ly/2TeJQY3',
      image: exploreImage,
      btnText: 'view on map'
    },
    {
      id: 'research',
      title: 'The latest research and insights from GFW',
      summary: 'Read about forests and climate on the GFW blog.',
      extLink: 'http://bit.ly/2TeJQY3',
      image: researchImage,
      btnText: 'read the blog'
    },
    {
      id: 'calculate',
      title: 'Calculate emissions from deforestation',
      summary:
        'Create a customized Forest Monitoring Report with the latest forest-related emissions.',
      extLink: 'http://bit.ly/2TeJQY3',
      image: calculateImage,
      btnText: 'view data'
    },
    {
      id: 'insights',
      title: 'Build your own insights',
      summary:
        'Use the custom dataset downloader to find information related to forests and climate.',
      extLink: 'http://bit.ly/2TeJQY3',
      image: insightsImage,
      btnText: 'view data'
    },
    {
      id: 'feedback',
      title:
        'What other biodiversity data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      extLink: '',
      theme: 'theme-card-dark',
      btnText: 'feedback'
    }
  ]
};
