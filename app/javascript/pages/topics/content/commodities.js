import investigateImage from 'pages/topics/assets/commodities/cards/investigate.png';
import exploreImage from 'pages/topics/assets/commodities/cards/explore.png';
import learnImage from 'pages/topics/assets/commodities/cards/learn.png';
import digger from 'pages/topics/assets/commodities/digger.svg';

export default {
  intro: {
    img: digger,
    title: '27% of global tree cover loss is commodity-driven deforestation.',
    text:
      'Production of commodities including beef, soy, palm oil, pulp, paper, energy and minerals,  is the leading cause of deforestation.  More sustainable commodity production is critical for conserving forests and mitigating climate change.'
  },
  slides: [
    {
      title: 'Commodities',
      subtitle: 'Pristine state',
      text:
        'Societies around the world have relied on nearby forests for food, fuel and medicine for thousands of years. Traditional practices like agroforestry, and small-scale and shifting agriculture had a reduced impact on the surrounding environment and generated socioeconomic benefits for local communities.',
      src: 'commodities1'
    },
    {
      title: 'Commodities',
      subtitle: 'Drivers of change',
      text:
        'As demand for commodities grows, deforestation from industrial-scale agriculture, illegal harvesting of timber and mining increases. The inability to track where products come from and a lack of consequences for environmental outcomes make it difficult to curb the impacts of these industries.',
      src: 'commodities2'
    },
    {
      title: 'Commodities',
      subtitle: 'Compromised state',
      text:
        'The unsustainable expansion of commodity production can permanently damage ecosystems, displace local communities, exacerbate climate change, and accelerate biodiversity loss.',
      src: 'commodities3'
    },
    {
      title: 'Commodities',
      subtitle: 'Recovery state',
      text:
        'Protecting forest habitats is key to maintaining biodiversity. With better data on where tree cover loss in important biodiversity ares is happening, governments can make more informed decisions related to concessions and conservation projects and civil society can call attention to areas at risk.',
      src: 'commodities4'
    }
  ],
  cards: [
    {
      id: 'map',
      title: 'Explore data on the map',
      summary: 'View commodity production areas, tree cover loss and more.',
      extLink: '/map',
      image: exploreImage,
      btnText: 'view on map'
    },
    {
      id: 'analysis',
      title: 'Investigate and monitor commodity production areas',
      summary:
        'View recent deforestation alerts and satellite imagery and and subscribe to alerts.',
      extLink: 'http://bit.ly/2TcafWm',
      image: investigateImage,
      btnText: 'view on map'
    },
    {
      id: 'learn',
      title: 'Learn more',
      summary: 'Read about forests and commodities on the GFW blog.',
      extLink: '',
      image: learnImage,
      btnText: 'read the blog'
    },
    {
      id: 'feedback',
      title:
        'What other commodities data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      extLink: '',
      btnText: 'feedback'
    }
  ]
};
