// intro
import intro1x from 'layouts/topics/assets/fires/intro/intro-fires.png';

// slides
import fires1 from 'layouts/topics/assets/fires/slides/fires1.png';
import fires2 from 'layouts/topics/assets/fires/slides/fires2.png';
import fires3 from 'layouts/topics/assets/fires/slides/fires3.png';
import fires4 from 'layouts/topics/assets/fires/slides/fires4.png';

// cards
import areas from 'layouts/topics/assets/fires/cards/areas.png';
import widgetStats from 'layouts/topics/assets/fires/cards/widget-stats.png';
import widgetCumulative from 'layouts/topics/assets/fires/cards/widget-cumulative.png';
import mapLayer from 'layouts/topics/assets/fires/cards/map-layer.png';
import forestFire from 'layouts/topics/assets/fires/cards/forest-fire.png';
import forestWatcher from 'layouts/topics/assets/fires/cards/forest-watcher.png';

// animations
import scene1 from 'layouts/topics/assets/fires/animations/scene1.json';
import birds1 from 'layouts/topics/assets/fires/animations/birds1.json';
import scene2 from 'layouts/topics/assets/fires/animations/scene2.json';
import scene3 from 'layouts/topics/assets/fires/animations/scene3.json';
import sunHeat3 from 'layouts/topics/assets/fires/animations/heat_sun3.json';
import scene4 from 'layouts/topics/assets/fires/animations/scene4.json';

export default {
  intro: {
    title: 'Fires',
    text:
      'Although wildfires are a natural occurrence within some forest ecosystems, fire seasons are becoming more extreme and widespread, even in tropical rainforests where fires are atypical and particularly damaging. Hotter, drier weather caused by climate change and poor land management create conditions favorable for more frequent, larger and higher-intensity wildfires.',
    img1x: intro1x
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
          content:
            'Learn about forest fires and climate change in boreal forests',
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
          content: 'Explore recent global trends in fire alerts',
          btnText: 'Explore the data',
          link:
            '/dashboards/global?category=fires&map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6IjBiMDIwOGI2LWI0MjQtNGI1Ny05ODRmLWNhZGRmYTI1YmEyMiIsImxheWVycyI6WyJjYzM1NDMyZC0zOGQ3LTRhMDMtODcyZS0zYTcxYTJmNTU1ZmMiLCJiNDUzNTBlMy01YTc2LTQ0Y2QtYjBhOS01MDM4YTBkOGJmYWUiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImJlYXJpbmciOjAsInBpdGNoIjowLCJ6b29tIjoyfQ%3D%3D',
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
          btnText: 'Explore the map',
          link:
            '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZDhkOTNmYmItODMwNC00MjRmLTk5ZmItMWU1MjFiNWRmNTZhIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImQ2MjFjZTBmLTA4NzItNDFlZi1iMmVjLTE4ZmFlYzNmZDFkOSJdfSx7ImRhdGFzZXQiOiIwYjAyMDhiNi1iNDI0LTRiNTctOTg0Zi1jYWRkZmEyNWJhMjIiLCJsYXllcnMiOlsiY2MzNTQzMmQtMzhkNy00YTAzLTg3MmUtM2E3MWEyZjU1NWZjIiwiYjQ1MzUwZTMtNWE3Ni00NGNkLWIwYTktNTAzOGEwZDhiZmFlIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6ImZlZTVmYzM4LTdhNjItNDliOC04ODc0LWRmYTMxY2JiMWVmNiIsImxheWVycyI6WyJmMTNmODZjYi0wOGI1LTRlNmMtYmI4ZC1iNDc4MjA1MmY5ZTUiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZSwiYmJveCI6bnVsbCwiYmVhcmluZyI6MCwicGl0Y2giOjB9&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9',
          position: [38, 45]
        }
      ],
      animations: [
        {
          id: 'fires-scene3',
          data: scene3,
          reverseLoop: true
        },
        {
          id: 'fires-sun3',
          data: sunHeat3,
          behind: true
        }
      ]
    },
    {
      title: 'Fires',
      subtitle: 'Recovery state',
      text:
        'Prescribed burning, improved maintenance of infrastructure, awareness raising and education on fire prevention, and policy interventions such as fire bans can reduce the risk of forest fires. Protecting forests from deforestation and degradation also improve forest resilience to fire.',
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
      id: 'aois',
      title: 'Monitor fires in your area',
      summary:
        'Save an area and subscribe to receive emails when new fire alerts are detected',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZDhkOTNmYmItODMwNC00MjRmLTk5ZmItMWU1MjFiNWRmNTZhIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImQ2MjFjZTBmLTA4NzItNDFlZi1iMmVjLTE4ZmFlYzNmZDFkOSJdfSx7ImRhdGFzZXQiOiIwYjAyMDhiNi1iNDI0LTRiNTctOTg0Zi1jYWRkZmEyNWJhMjIiLCJsYXllcnMiOlsiY2MzNTQzMmQtMzhkNy00YTAzLTg3MmUtM2E3MWEyZjU1NWZjIiwiYjQ1MzUwZTMtNWE3Ni00NGNkLWIwYTktNTAzOGEwZDhiZmFlIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6ImZlZTVmYzM4LTdhNjItNDliOC04ODc0LWRmYTMxY2JiMWVmNiIsImxheWVycyI6WyJmMTNmODZjYi0wOGI1LTRlNmMtYmI4ZC1iNDc4MjA1MmY5ZTUiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZSwiYmJveCI6bnVsbCwiYmVhcmluZyI6MCwicGl0Y2giOjB9&menu=eyJtZW51U2VjdGlvbiI6Im15LWdmdyIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9',
      image: areas,
      btnText: 'view on map'
    },
    {
      id: 'global',
      title: 'Explore recent trends in fire alerts',
      summary:
        'See if current trends in fire alerts are normal, above or below average',
      image: widgetStats,
      selector: {
        path: '/dashboards/country/{iso}?widget=firesAlerts&category=fires#firesAlerts'
      }
    },
    {
      id: 'cumulative',
      title: 'View cumulative fire alerts',
      summary: 'Compare cumulative fire alerts this year to past years.',
      link:
        '/map?map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6Ijg5N2VjYzc2LTIzMDgtNGM1MS1hZWIzLTQ5NWRlMGJkY2E3OSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJjMzA3NWM1YS01NTY3LTRiMDktYmMwZC05NmVkMTY3M2Y4YjYiXSwidGltZWxpbmVQYXJhbXMiOnsic3RhcnREYXRlIjoiMjAxNy0wMy0xMSIsImVuZERhdGUiOiIyMDE3LTEyLTMwIiwidHJpbUVuZERhdGUiOiIyMDE3LTEyLTMwIn19LHsiZGF0YXNldCI6ImM3Yzc2Y2MxLTUxNzgtNDc0YS04YjZhLTYwYjg5NWUwMjI2MCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyI0MjQyN2E1NS1jOGI1LTRmYWMtOGRiMy1hOWQ1OWUxYjI2ZjciXSwiaXNvIjoiIn0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV0sImNhbkJvdW5kIjpmYWxzZSwiem9vbSI6NSwiY2VudGVyIjp7ImxhdCI6MTIuNzA0NjUwNTA4Mjg3ODkzLCJsbmciOjk2LjI4NDE3OTY4NzUwMDAxfSwiYmJveCI6bnVsbH0%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UiLCJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIn0%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFuYWx5emVBbkFyZWEiLCJzdGVwSW5kZXgiOjB9',
      image: widgetCumulative,
      selector: {
        path: '/dashboards/country/{iso}?widget=firesAlertsCumulative&category=fires#firesAlertsCumulative'
      }
    },
    {
      id: 'map',
      title: 'View fire alerts on the map',
      summary:
        'View fire alerts - updated daily - on the map anywhere in the world.',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZDhkOTNmYmItODMwNC00MjRmLTk5ZmItMWU1MjFiNWRmNTZhIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImQ2MjFjZTBmLTA4NzItNDFlZi1iMmVjLTE4ZmFlYzNmZDFkOSJdfSx7ImRhdGFzZXQiOiIwYjAyMDhiNi1iNDI0LTRiNTctOTg0Zi1jYWRkZmEyNWJhMjIiLCJsYXllcnMiOlsiY2MzNTQzMmQtMzhkNy00YTAzLTg3MmUtM2E3MWEyZjU1NWZjIiwiYjQ1MzUwZTMtNWE3Ni00NGNkLWIwYTktNTAzOGEwZDhiZmFlIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6ImZlZTVmYzM4LTdhNjItNDliOC04ODc0LWRmYTMxY2JiMWVmNiIsImxheWVycyI6WyJmMTNmODZjYi0wOGI1LTRlNmMtYmI4ZC1iNDc4MjA1MmY5ZTUiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZSwiYmJveCI6bnVsbCwiYmVhcmluZyI6MCwicGl0Y2giOjB9&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9',
      image: mapLayer,
      btnText: 'view on map'
    },
    {
      id: 'blog-research',
      title: 'The latest research and insights on fires from GFW',
      summary:
        'Learn about the complex relationship between forests and fires on the GFW blog.',
      link: 'https://blog.globalforestwatch.org/fires',
      image: forestFire,
      btnText: 'read the blog'
    },
    {
      id: 'blog-fw',
      title: 'Navigate to and report on fire alerts in the field',
      summary:
        'Use the Forest Watcher mobile app to navigate to and report on fire alerts offline in the field.',
      link: 'https://forestwatcher.globalforestwatch.org/',
      image: forestWatcher,
      btnText: 'go to app'
    },
    {
      id: 'feedback',
      title: 'What other fires data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      theme: 'theme-card-dark',
      btnText: 'feedback'
    }
  ]
};
