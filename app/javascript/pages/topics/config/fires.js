// intro
import intro1x from 'pages/topics/assets/biodiversity/intro/tiger.png';
import intro2x from 'pages/topics/assets/biodiversity/intro/tiger@2x.png';

// slides
import fires1 from 'pages/topics/assets/fires/slides/fires1.png';
import fires2 from 'pages/topics/assets/fires/slides/fires2.png';
import fires3 from 'pages/topics/assets/fires/slides/fires3.png';
import fires4 from 'pages/topics/assets/fires/slides/fires4.png';

// cards
import investigate from 'pages/topics/assets/biodiversity/cards/investigate.png';
import investigateLarge from 'pages/topics/assets/biodiversity/cards/investigate@2x.png';
import explore from 'pages/topics/assets/biodiversity/cards/explore.png';
import exploreLarge from 'pages/topics/assets/biodiversity/cards/explore@2x.png';
import tigers from 'pages/topics/assets/biodiversity/cards/tigers.png';
import tigersLarge from 'pages/topics/assets/biodiversity/cards/tigers@2x.png';

// animations
import scene1 from 'pages/topics/assets/fires/animations/scene1.json';
import birds1 from 'pages/topics/assets/fires/animations/birds1.json';
import scene2 from 'pages/topics/assets/fires/animations/scene2.json';
import scene3 from 'pages/topics/assets/fires/animations/scene3.json';
import sunHeat3 from 'pages/topics/assets/fires/animations/heat_sun3.json';
import scene4 from 'pages/topics/assets/fires/animations/scene4.json';

export default {
  intro: {
    title: 'Fires',
    text:
      'Although wildfires are a natural occurrence within some forest ecosystems, fire seasons are becoming more extreme and widespread, even in tropical rainforests where fires are atypical and particularly damaging. Hotter, drier weather caused by climate change and poor land management create conditions favorable for more frequent, larger and higher-intensity wildfires.'
  },
  slides: [
    {
      title: 'Fires',
      subtitle: 'Natural state',
      text:
        'In higher-latitude forests, fires help maintain a healthy forest ecosystem by releasing important nutrients into the soil and aiding in seed dispersal. In tropical forests, local and indigenous communities have used controlled fires for centuries to clear land for agriculture.',
      img1x: fires1,
      prompts: [
        {
          id: 'fires-learn',
          content: 'Learn about forest fires and climate change in boreal forests',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/fires/boreal-forest-fires-a-climate-concern',
          position: [65, 38]
        }
      ],
      animations: [
        {
          id: 'fires-scene1',
          data: scene1
        },
        {
          id: 'fires-birds1',
          data: birds1,
          behind: true
        }
      ]
    },
    {
      title: 'Fires',
      subtitle: 'Drivers of change',
      text:
        'Climate change and forest degradation and fragmentation have led to more fire-prone conditions globally. With hotter and drier conditions, fires - either ignited by humans or by lightning - are more likely to burn over larger areas and at hotter temperatures. Forests degraded by logging and disease, and fragmented by deforestation are also more susceptible to fire.',
      img1x: fires2,
      prompts: [
        {
          id: 'fires-learn',
          content:
            'Explore recent global trends in fire alerts',
          btnText: 'Explore the data',
          link:
            '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiNmExYWZlNzgtMDgxMy00NWM0LTgyMmYtYjUyZmUxMGY5M2YyIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbIjY0Nzk5OGMyLWNkZjYtNDNmZC1iYmZmLTE1MzU4ZjExMWZlOSJdfSx7ImRhdGFzZXQiOiJmZGM4ZGMxYi0yNzI4LTRhNzktYjIzZi1iMDk0ODUwNTJiOGQiLCJsYXllcnMiOlsiNmY2Nzk4ZTYtMzllYy00MTYzLTk3OWUtMTgyYTc0Y2E2NWVlIiwiYzVkMWUwMTAtMzgzYS00NzEzLTlhYWEtNDRmNzI4YzA1NzFjIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6ImZlZTVmYzM4LTdhNjItNDliOC04ODc0LWRmYTMxY2JiMWVmNiIsImxheWVycyI6WyJmMTNmODZjYi0wOGI1LTRlNmMtYmI4ZC1iNDc4MjA1MmY5ZTUiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZSwiYmJveCI6bnVsbCwiYmVhcmluZyI6MCwicGl0Y2giOjB9&menu=eyJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIiwiZGF0YXNldENhdGVnb3J5IjoiYmlvZGl2ZXJzaXR5In0%3D',
          position: [80, 60]
        }
      ],
      animations: [
        {
          id: 'fires-scene2',
          data: scene2
        }
      ]
    },
    {
      title: 'Fires',
      subtitle: 'Compromised state',
      text:
        'Wildfires release carbon dioxide and other pollutants into the atmosphere, exacerbating global warming, and in severe cases, irreparably damaging forests ecosystems. The resulting smoke and haze can travel miles, creating public health crises as people breathe in unhealthy levels of pollutants. Uncontrolled wildfires cause billions of dollars in economic damage each year as property and natural tourist attractions are destroyed, water supplies are polluted, and economies are crippled by evacuations.',
      img1x: fires3,
      prompts: [
        {
          id: 'fires-status',
          content:
            'View fire alerts to see where the most fires are occurring now.',
          btnText: 'Explore the data',
          link:
            'https://blog.globalforestwatch.org/data/worlds-last-intact-forests-are-becoming-increasingly-fragmented',
          position: [38, 45]
        }
      ],
      animations: [
        {
          id: 'fires-scene3',
          data: scene3
        },
        {
          id: 'fires-sun3',
          data: sunHeat3
        }
      ]
    },
    {
      title: 'Fires',
      subtitle: 'Recovery state',
      text:
        'Protecting forest habitats is key to maintaining biodiversity. With better data on where tree cover loss in important biodiversity areas is happening, governments can make more informed decisions related to concessions and conservation projects and civil society can call attention to areas at risk.',
      img1x: fires4,
      prompts: [
        {
          id: 'fires-learn',
          content:
            "Learn about one organization's fire safety efforts in Riau, Indonesia",
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/people/women-research-institute-blazes-path-towards-fire-safety-in-riau-communities',
          position: [35, 55]
        }
      ],
      animations: [
        {
          id: 'fires-scene4',
          data: scene4,
          behind: true
        }
      ]
    }
  ],
  cards: [
    {
      id: 'alerts',
      title: 'Investigate and monitor biodiversity areas',
      summary:
        'View recent deforestation alerts and satellite imagery and and subscribe to alerts',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0Ijo1LjM1MzUyMTM1NTMzNzMzNCwibG5nIjotMi40NjA5Mzc1MDAwMDAwMDA0fSwiem9vbSI6MywiZGF0YXNldHMiOlt7ImRhdGFzZXQiOiJlNjYzZWIwOS0wNGRlLTRmMzktYjg3MS0zNWM2YzJlZDEwYjUiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiZGQ1ZGY4N2YtMzljMi00YWViLWE0NjItM2VmOTY5YjIwYjY2Il19LHsiZGF0YXNldCI6IjNiMTJjYzVmLTRiZjgtNDg1Ny05MDllLWE4NzkxMTI1YmJmMSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmZGZkNDI2Yi0xMWQwLTQ1ZmMtOTFmNC0zNzA2ZWJiMGU3OTgiXX0seyJkYXRhc2V0IjoiM2E2MzgxMDItYWI1MC00NzE3LWEwZmUtYjI3YmQ3OWQxOGMyIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbIjNjNDRkYThmLTE1OWEtNDFmMi05ZmRiLTQ0OGU0Y2QwOTIzZCJdfSx7ImRhdGFzZXQiOiJmZGM4ZGMxYi0yNzI4LTRhNzktYjIzZi1iMDk0ODUwNTJiOGQiLCJsYXllcnMiOlsiNmY2Nzk4ZTYtMzllYy00MTYzLTk3OWUtMTgyYTc0Y2E2NWVlIiwiYzVkMWUwMTAtMzgzYS00NzEzLTlhYWEtNDRmNzI4YzA1NzFjIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XSwiYmFzZW1hcCI6eyJ2YWx1ZSI6ImRlZmF1bHQifSwibGFiZWwiOiJkZWZhdWx0IiwiY2FuQm91bmQiOmZhbHNlLCJiYm94IjpudWxsfQ%3D%3D&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFuYWx5emVBbkFyZWEiLCJzdGVwSW5kZXgiOjB9',
      img1x: investigate,
      img2x: investigateLarge,
      btnText: 'view on map'
    },
    {
      id: 'map',
      title: 'Explore data on the map',
      summary:
        'View important areas for biodiversity, biodiversity hotspots and more',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiJhNjg0YTliYi02M2YyLTRiZWEtYmY2Mi1mZDVlODBkMjNkNzUiLCJsYXllcnMiOlsiZGZkOWRlYjYtOGQzOS00NjQwLTg1NzEtNDM4OWQ1ZDg4OThhIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6ImZlZTVmYzM4LTdhNjItNDliOC04ODc0LWRmYTMxY2JiMWVmNiIsImxheWVycyI6WyI0M2EyMDVmZS1hYWQzLTRkYjEtODgwNy1jMzk5YTMyNjQzNDkiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZX0%3D&menu=eyJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIiwiZGF0YXNldENhdGVnb3J5IjoiYmlvZGl2ZXJzaXR5In0%3D',
      img1x: explore,
      img2x: exploreLarge,
      btnText: 'view on map'
    },
    {
      id: 'tigers',
      title: 'How is tiger habitat faring?',
      summary:
        '13 countries aim to double the wild tiger population by 2022 - the next year of the tiger. View tree cover loss in the past year in important tiger habitat.',
      link:
        '/map?map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6Ijg5N2VjYzc2LTIzMDgtNGM1MS1hZWIzLTQ5NWRlMGJkY2E3OSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJjMzA3NWM1YS01NTY3LTRiMDktYmMwZC05NmVkMTY3M2Y4YjYiXSwidGltZWxpbmVQYXJhbXMiOnsic3RhcnREYXRlIjoiMjAxNy0wMy0xMSIsImVuZERhdGUiOiIyMDE3LTEyLTMwIiwidHJpbUVuZERhdGUiOiIyMDE3LTEyLTMwIn19LHsiZGF0YXNldCI6ImM3Yzc2Y2MxLTUxNzgtNDc0YS04YjZhLTYwYjg5NWUwMjI2MCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyI0MjQyN2E1NS1jOGI1LTRmYWMtOGRiMy1hOWQ1OWUxYjI2ZjciXSwiaXNvIjoiIn0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV0sImNhbkJvdW5kIjpmYWxzZSwiem9vbSI6NSwiY2VudGVyIjp7ImxhdCI6MTIuNzA0NjUwNTA4Mjg3ODkzLCJsbmciOjk2LjI4NDE3OTY4NzUwMDAxfSwiYmJveCI6bnVsbH0%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UiLCJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIn0%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFuYWx5emVBbkFyZWEiLCJzdGVwSW5kZXgiOjB9',
      img1x: tigers,
      img2x: tigersLarge,
      btnText: 'view on map'
    },
    {
      id: 'feedback',
      title:
        'What other biodiversity data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      theme: 'theme-card-dark',
      btnText: 'feedback'
    }
  ]
};
