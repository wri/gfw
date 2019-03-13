import healthImage from 'pages/topics/assets/water/cards/health.png';
import solutionsImage from 'pages/topics/assets/water/cards/solutions.png';
import learnImage from 'pages/topics/assets/water/cards/learn.png';
import water from 'pages/topics/assets/water/water.svg';

export default {
  intro: {
    img: water,
    title:
      "Nearly 20% of the world's population will be at-risk for floods by 2050",
    text:
      'Forests are a natural, cost-effective way to secure ample, clean water and to protect against natural disasters like floods and droughts.'
  },
  slides: [
    {
      title: 'Water',
      subtitle: 'Pristine state',
      text:
        'Forests are critical to supplying clean and plentiful water around the world. Healthy forests filter water, reduce erosion, regulate rainfall, recharge groundwater tables and buffer against the impacts of droughts and floods. Coastal forests are especially important in providing protection from surges and are crucial breeding grounds for marine life.',
      src: 'water1'
    },
    {
      title: 'Water',
      subtitle: 'Drivers of change',
      text:
        'Deforestation compromises watershed health and increases risk of floods and drought. More frequent and severe forest fires, exacerbated by climate change, can pollute water supplies, reduce forest cover and devastate communities.',
      src: 'water2'
    },
    {
      title: 'Water',
      subtitle: 'Compromised state',
      text:
        'Deforested watersheds are unable to properly filter water and regulate water supply for the communities that depend on them. Erosion, flood and landslide risks increase without forests to hold sediment in place and channel precipitation under ground. Deforested coasts are more vulnerable to storm surges and fisheries suffer.',
      src: 'water3'
    },
    {
      title: 'Water',
      subtitle: 'Recovery state',
      text:
        'Restoring and conserving forests can help increase water security. There is a growing wave of investments in forests for water, given the economic, environmental and public health benefits these critical lands can generate.',
      src: 'water4'
    }
  ],
  cards: [
    {
      id: 'health',
      title: 'How healthy is your watershed? ',
      summary: 'Measure forest and track recent forest loss in your watershed.',
      extLink: '',
      image: healthImage,
      btnText: 'view on map'
    },
    {
      id: 'solutions',
      title: 'Forest solutions for healthy watersheds',
      summary:
        'Learn about options for mitigating risks to watersheds and read case studies.',
      extLink: '',
      image: solutionsImage,
      btnText: 'view data'
    },
    {
      id: 'learn',
      title: 'Learn more',
      summary: 'Read about how forests can benefit water supply globally.',
      extLink: '',
      image: learnImage,
      btnText: 'view data'
    },
    {
      id: 'feedback',
      title:
        'What other water-related data and analysis would you like to see on GFW? ',
      summary: 'Tell us!',
      extLink: '',
      btnText: 'feedback'
    }
  ]
};
