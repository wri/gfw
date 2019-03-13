import investigateImage from 'pages/topics/assets/biodiversity/cards/investigate.png';
import exploreImage from 'pages/topics/assets/biodiversity/cards/explore.png';
import tigersImage from 'pages/topics/assets/biodiversity/cards/tigers.png';
import tiger from 'pages/topics/assets/biodiversity/tiger.svg';

export default {
  intro: {
    img: tiger,
    title: '80% of terrestrial species live in forests.',
    text:
      'We are currently undergoing the sixth great mass extinction of species. Human activity is driving extinction at a rate 1,000 to 10,000 times beyond natural levels. Protecting forest habitats is key to protecting our planet’s remaining biodiversity.'
  },
  slides: [
    {
      title: 'Biodiversity',
      subtitle: 'Pristine state',
      text:
        'Forests are critical homes to plant and animal species. In turn, species that live within forests play important role in maintaining forest health.',
      src: 'biodiversity1'
    },
    {
      title: 'Biodiversity',
      subtitle: 'Drivers of change',
      text:
        'Changes to forested habitats can lead to the extinction of the species that depend on them. With fewer species, the resilience of the entire food chain suffers.',
      src: 'biodiversity2'
    },
    {
      title: 'Biodiversity',
      subtitle: 'Compromised state',
      text:
        'Failure to protect critical wildlife areas from deforestation means the loss of biodiversity and extinction of endangered species.',
      src: 'biodiversity3'
    },
    {
      title: 'Biodiversity',
      subtitle: 'Recovery state',
      text:
        'Protecting forest habitats is key to maintaining biodiversity. With better data on where tree cover loss in important biodiversity ares is happening, governments can make more informed decisions related to concessions and conservation projects and civil society can call attention to areas at risk.',
      src: 'biodiversity4'
    }
  ],
  cards: [
    {
      id: 'alerts',
      title: 'Investigate and monitor biodiversity areas',
      summary:
        'View recent deforestation alerts and satellite imagery and and subscribe to alerts',
      extLink: 'http://bit.ly/2TeK815',
      image: investigateImage,
      btnText: 'view on map'
    },
    {
      id: 'map',
      title: 'Explore data on the map',
      summary:
        'View important areas for biodiversity, biodiversity hotspots and more',
      extLink: 'http://bit.ly/2TeK815',
      image: exploreImage,
      btnText: 'view on map'
    },
    {
      id: 'tigers',
      title: 'How is tiger habitat faring?',
      summary:
        '13 countries aim to double the wild tiger population by 2022 - the next year of the tiger. View tree cover loss in the past year in important tiger habitat.',
      extLink: 'http://bit.ly/2TeJQY3',
      image: tigersImage,
      btnText: 'view on map'
    },
    {
      id: 'feedback',
      title:
        'What other biodiversity data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      theme: 'theme-card-dark',
      extLink: '',
      btnText: 'feedback'
    }
  ]
};
