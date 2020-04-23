// intro
import intro1x from 'pages/topics/assets/fires/intro/intro-fires.png';

// slides
import fires1 from 'pages/topics/assets/fires/slides/fires1.png';
import fires2 from 'pages/topics/assets/fires/slides/fires2.png';
import fires3 from 'pages/topics/assets/fires/slides/fires3.png';
import fires4 from 'pages/topics/assets/fires/slides/fires4.png';

// cards
import areas from 'pages/topics/assets/fires/cards/areas.png';
import widgetStats from 'pages/topics/assets/fires/cards/widget-stats.png';
import widgetCumulative from 'pages/topics/assets/fires/cards/widget-cumulative.png';
import mapLayer from 'pages/topics/assets/fires/cards/map-layer.png';
import forestFire from 'pages/topics/assets/fires/cards/forest-fire.png';
import forestWatcher from 'pages/topics/assets/fires/cards/forest-watcher.png';

// animations
import scene1 from 'pages/topics/assets/fires/animations/scene1.json';
import birds1 from 'pages/topics/assets/fires/animations/birds1.json';
import scene2 from 'pages/topics/assets/fires/animations/scene2.json';
import scene3 from 'pages/topics/assets/fires/animations/scene3.json';
import sunHeat3 from 'pages/topics/assets/fires/animations/heat_sun3.json';
import scene4 from 'pages/topics/assets/fires/animations/scene4.json';
import nycWidgetConfig from 'components/widgets/climate/cumulative-emissions';

const nycWidgetIsos = nycWidgetConfig.whitelists.adm0;

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
      id: 'aois',
      title: 'Monitor fires in your area',
      summary:
        'Save an area and subscribe to receive emails when new fire alerts are detected',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImJlYXJpbmciOjAsInBpdGNoIjowLCJ6b29tIjoyLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6IjFkM2NjZjliLTEwMmUtNGMwYi1iMmVhLTJhYmNjNzEyZTE5NCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyI5M2UzMzkzMi0zOTU5LTQyMDEtYjhjOC02ZWMwYjMyNTk2ZTAiXX0seyJkYXRhc2V0IjoiMGIwMjA4YjYtYjQyNC00YjU3LTk4NGYtY2FkZGZhMjViYTIyIiwibGF5ZXJzIjpbImNjMzU0MzJkLTM4ZDctNGEwMy04NzJlLTNhNzFhMmY1NTVmYyIsImI0NTM1MGUzLTVhNzYtNDRjZC1iMGE5LTUwMzhhMGQ4YmZhZSJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV0sImNhbkJvdW5kIjp0cnVlfQ%3D%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6Im15LWdmdyJ9',
      img1x: areas,
      btnText: 'view on map'
    },
    {
      id: 'map',
      title: 'Explore recent trends in fire alerts',
      summary:
        'See if current trends in fire alerts are normal, above or below average',
      img1x: widgetStats,
      selector: {
        options: nycWidgetIsos.map(iso => ({
          label: iso,
          value: iso,
          path: `/dashboards/country/${
            iso
          }?widget=cumulativeGlad&category=climate#cumulativeGlad`
        }))
      }
    },
    {
      id: 'cumulative',
      title: 'View cumulative fire alerts',
      summary:
        'Compare cumulative fire alerts this year to past years.',
      link:
        '/map?map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6Ijg5N2VjYzc2LTIzMDgtNGM1MS1hZWIzLTQ5NWRlMGJkY2E3OSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJjMzA3NWM1YS01NTY3LTRiMDktYmMwZC05NmVkMTY3M2Y4YjYiXSwidGltZWxpbmVQYXJhbXMiOnsic3RhcnREYXRlIjoiMjAxNy0wMy0xMSIsImVuZERhdGUiOiIyMDE3LTEyLTMwIiwidHJpbUVuZERhdGUiOiIyMDE3LTEyLTMwIn19LHsiZGF0YXNldCI6ImM3Yzc2Y2MxLTUxNzgtNDc0YS04YjZhLTYwYjg5NWUwMjI2MCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyI0MjQyN2E1NS1jOGI1LTRmYWMtOGRiMy1hOWQ1OWUxYjI2ZjciXSwiaXNvIjoiIn0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV0sImNhbkJvdW5kIjpmYWxzZSwiem9vbSI6NSwiY2VudGVyIjp7ImxhdCI6MTIuNzA0NjUwNTA4Mjg3ODkzLCJsbmciOjk2LjI4NDE3OTY4NzUwMDAxfSwiYmJveCI6bnVsbH0%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UiLCJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIn0%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFuYWx5emVBbkFyZWEiLCJzdGVwSW5kZXgiOjB9',
      img1x: widgetCumulative,
      btnText: 'view data'
    },
    {
      id: 'cumulative',
      title: 'View fire alerts on the map',
      summary:
        'View fire alerts - updated daily - on the map anywhere in the world.',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImJlYXJpbmciOjAsInBpdGNoIjowLCJ6b29tIjoyLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6IjFkM2NjZjliLTEwMmUtNGMwYi1iMmVhLTJhYmNjNzEyZTE5NCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyI5M2UzMzkzMi0zOTU5LTQyMDEtYjhjOC02ZWMwYjMyNTk2ZTAiXX0seyJkYXRhc2V0IjoiMGIwMjA4YjYtYjQyNC00YjU3LTk4NGYtY2FkZGZhMjViYTIyIiwibGF5ZXJzIjpbImNjMzU0MzJkLTM4ZDctNGEwMy04NzJlLTNhNzFhMmY1NTVmYyIsImI0NTM1MGUzLTVhNzYtNDRjZC1iMGE5LTUwMzhhMGQ4YmZhZSJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV0sImNhbkJvdW5kIjp0cnVlfQ%3D%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6Im15LWdmdyJ9',
      img1x: mapLayer,
      btnText: 'view on map'
    },
    {
      id: 'blog',
      title: 'The latest research and insights on fires from GFW',
      summary:
        'Learn about the complex relationship between forests and fires on the GFW blog.',
      link:
        'https://blog.globalforestwatch.org/fires',
      img1x: forestFire,
      btnText: 'read the blog'
    },
    {
      id: 'blog',
      title: 'Navigate to and report on fire alerts in the field',
      summary:
        'Use the Forest Watcher mobile app to navigate to and report on fire alerts offline in the field.',
      link:
        'https://forestwatcher.globalforestwatch.org/',
      img1x: forestWatcher,
      btnText: 'go to app'
    },
    {
      id: 'feedback',
      title:
        'What other fires data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      theme: 'theme-card-dark',
      btnText: 'feedback'
    }
  ]
};
