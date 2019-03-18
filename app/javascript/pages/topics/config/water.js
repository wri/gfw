import healthImage from 'pages/topics/assets/water/cards/health.png';
import solutionsImage from 'pages/topics/assets/water/cards/solutions.png';
import learnImage from 'pages/topics/assets/water/cards/learn.png';
import water from 'pages/topics/assets/water/water-intro.svg';

export default {
  intro: {
    img: water,
    title:
      "Nearly 20% of the world's population will be at-risk for floods by 2050.",
    text:
      'Forests are a natural, cost-effective way to secure ample, clean water and to protect against natural disasters like floods and droughts.'
  },
  slides: [
    {
      title: 'Water',
      subtitle: 'Ideal state',
      text:
        'Forests are critical to supplying clean and plentiful water around the world. Healthy forests filter water, reduce erosion, regulate rainfall, recharge groundwater tables and buffer against the impacts of droughts and floods. Coastal forests are especially important in providing protection from surges and are crucial breeding grounds for marine life.',
      src: 'water1',
      prompts: [
        {
          id: 'water-learn',
          content: 'GFW enables investigation into watershed areas.',
          btnText: 'Explore the data',
          link:
            '/map?map=eyJkYXRhc2V0cyI6W3sibGF5ZXJzIjpbImQ1OTBmODNjLTliNTQtNDU0Mi04ZDI3LWY2MWI4YjE5ZGY0NiJdLCJkYXRhc2V0IjoiNjMyOTViMDUtNTVhMS00NTZjLWE1NmMtYzljY2IzYTcxMWVjIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiMDQ0ZjRhZjgtYmU3Mi00OTk5LWI3ZGQtMTM0MzRmYzRhMzk0IiwibGF5ZXJzIjpbIjc4NzQ3ZWExLTM0YTktNGFhNy1iMDk5LWJkYjg5NDgyMDBmNCJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19',
          position: [21, 18]
        },
        {
          id: 'water-read',
          content: 'Learn how water depends on healthy forests.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/gfw-community/3-surprising-ways-water-depends-on-healthy-forests',
          position: [58, 74]
        },
        {
          id: 'water-explore-data',
          content: 'Mangrove forests around the world are visable on GFW.',
          btnText: 'Explore the data',
          link:
            '/map?map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImJkNWQ3OTI0LTYxMWUtNDMwMi05MTg1LTgwNTRhY2IwYjQ0YiIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyI0OWUzZjk1NS0yYmFiLTRmNzMtODU4OS1jOWMwMzliOGRhMjkiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiIwNDRmNGFmOC1iZTcyLTQ5OTktYjdkZC0xMzQzNGZjNGEzOTQiLCJsYXllcnMiOlsiNzg3NDdlYTEtMzRhOS00YWE3LWIwOTktYmRiODk0ODIwMGY0Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XSwiY2FuQm91bmQiOnRydWV9',
          position: [31, 71]
        }
      ]
    },
    {
      title: 'Water',
      subtitle: 'Drivers of change',
      text:
        'Deforestation compromises watershed health and increases risk of floods and drought. More frequent and severe forest fires, exacerbated by climate change, can pollute water supplies, reduce forest cover and devastate communities.',
      src: 'water2',
      prompts: [
        {
          id: 'water-learn',
          content:
            "GFW tracks fires and recent tree cover loss in the world's major watersheds.",
          btnText: 'Explore the data',
          link:
            '/map?mainMap=eyJzaG93QmFzZW1hcHMiOmZhbHNlfQ%3D%3D&map=eyJ6b29tIjoyLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImNhbkJvdW5kIjp0cnVlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3sibGF5ZXJzIjpbImQ1OTBmODNjLTliNTQtNDU0Mi04ZDI3LWY2MWI4YjE5ZGY0NiJdLCJkYXRhc2V0IjoiNjMyOTViMDUtNTVhMS00NTZjLWE1NmMtYzljY2IzYTcxMWVjIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiMGYwZWEwMTMtMjBhYy00ZjRiLWFmNTYtYzU3ZTk5ZjM5ZTA4Iiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbIjUzNzFkMGMwLTRlNWYtNDVmNy05ZmYyLWZlNTM4OTE0ZjdhMyJdfSx7ImRhdGFzZXQiOiJlNjYzZWIwOS0wNGRlLTRmMzktYjg3MS0zNWM2YzJlZDEwYjUiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiZGQ1ZGY4N2YtMzljMi00YWViLWE0NjItM2VmOTY5YjIwYjY2Il19XX0%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6IiJ9',
          position: [48, 43]
        },
        {
          id: 'water-read',
          content: 'Learn how forest loss impacts your water supply.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/data/watersheds-lost-up-to-22-of-their-forests-in-14-years-heres-how-it-affects-your-water-supply',
          position: [55, 73]
        }
      ]
    },
    {
      title: 'Water',
      subtitle: 'Compromised state',
      text:
        'Deforested watersheds are unable to properly filter water and regulate water supply for the communities that depend on them. Erosion, flood and landslide risks increase without forests to hold sediment in place and channel precipitation under ground. Deforested coasts are more vulnerable to storm surges and fisheries suffer.',
      src: 'water3',
      prompts: [
        {
          id: 'water-learn',
          content:
            'Learn about the deadly impacts of deforestation and heavy rains in Kerala India.',
          btnText: 'Read the blog',
          position: [36, 42]
        },
        {
          id: 'water-read',
          content:
            "Read how deforestation is exasterbating Jakarta's water risks.",
          btnText: 'Read the blog',
          link:
            'https://www.wri.org/blog/2017/07/without-forests-jakartas-water-situation-worsens',
          position: [62, 65]
        }
      ]
    },
    {
      title: 'Water',
      subtitle: 'Recovery state',
      text:
        'Restoring and conserving forests can help increase water security. There is a growing wave of investments in forests for water, given the economic, environmental and public health benefits these critical lands can generate.',
      src: 'water4',
      prompts: [
        {
          id: 'water-learn',
          content: 'Learn how WRI works with cities to protect forests.',
          btnText: 'Read the blog',
          link:
            'https://www.wri.org/blog/2018/09/45-cities-pursue-new-urban-strategy-protecting-forests-near-and-far',
          position: [70, 50]
        },
        {
          id: 'water-read',
          content:
            'Learn how the City of Sao Paulo utilizes forests to clean its water.',
          btnText: 'Read the blog',
          link:
            'https://www.wri.org/publication/natural-infrastructure-sao-paulo',
          position: [15, 47]
        },
        {
          id: 'water-forest',
          content:
            'Read about the Forest Resilience Bond, a project that finances forest restoration now to prevent future fires',
          btnText: 'Read the blog',
          link:
            'https://www.wri.org/blog/2017/09/wildfires-scorch-us-forests-forest-resilience-bond-blazes-new-trail',
          position: [57, 75]
        }
      ]
    }
  ],
  cards: [
    {
      id: 'health',
      title: 'How healthy is your watershed?',
      summary: 'Measure forest and track recent forest loss in your watershed.',
      link:
        '/map?mainMap=eyJzaG93QmFzZW1hcHMiOnRydWV9&map=eyJ6b29tIjoyLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImNhbkJvdW5kIjpmYWxzZSwiYmJveCI6bnVsbCwiZGF0YXNldHMiOlt7ImxheWVycyI6WyJkNTkwZjgzYy05YjU0LTQ1NDItOGQyNy1mNjFiOGIxOWRmNDYiXSwiZGF0YXNldCI6IjYzMjk1YjA1LTU1YTEtNDU2Yy1hNTZjLWM5Y2NiM2E3MTFlYyIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6IjcwZTI1NDljLWQ3MjItNDRhNi1hOGQ3LTRhMzg1ZDc4NTY1ZSIsImxheWVycyI6WyIzYjIyYTU3NC0yNTA3LTRiNGEtYTI0Ny04MDA1N2MxYTFhZDQiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiODk3ZWNjNzYtMjMwOC00YzUxLWFlYjMtNDk1ZGUwYmRjYTc5IiwibGF5ZXJzIjpbImMzMDc1YzVhLTU1NjctNGIwOS1iYzBkLTk2ZWQxNjczZjhiNiJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiIwNDRmNGFmOC1iZTcyLTQ5OTktYjdkZC0xMzQzNGZjNGEzOTQiLCJsYXllcnMiOlsiNzg3NDdlYTEtMzRhOS00YWE3LWIwOTktYmRiODk0ODIwMGY0Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XX0%3D',
      image: healthImage,
      btnText: 'view on map'
    },
    {
      id: 'solutions',
      title: 'Forest solutions for healthy watersheds',
      summary:
        'Learn about options for mitigating risks to watersheds and read case studies.',
      extLink:
        'https://www.wri.org/publication/protecting-drinking-water-source',
      image: solutionsImage,
      btnText: 'view data'
    },
    {
      id: 'learn',
      title: 'Learn more',
      summary: 'Read about how forests can benefit water supply globally.',
      extLink:
        'http://www.wri.org/our-work/project/natural-infrastructure-water/blog',
      image: learnImage,
      btnText: 'view data'
    },
    {
      id: 'feedback',
      title:
        'What other water-related data and analysis would you like to see on GFW? ',
      summary: 'Tell us!',
      extLink: '',
      theme: 'theme-card-dark',
      btnText: 'feedback'
    }
  ]
};
