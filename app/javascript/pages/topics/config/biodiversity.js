// intro
import intro1x from 'pages/topics/assets/biodiversity/intro/tiger.png?webp';
import intro2x from 'pages/topics/assets/biodiversity/intro/tiger@2x.png?webp';

// slides
import biodiversity1 from 'pages/topics/assets/biodiversity/slides/biodiversity1.png?webp';
import biodiversity1Large from 'pages/topics/assets/biodiversity/slides/biodiversity1@2x.png?webp';
import biodiversity2 from 'pages/topics/assets/biodiversity/slides/biodiversity2.png?webp';
import biodiversity2Large from 'pages/topics/assets/biodiversity/slides/biodiversity2@2x.png?webp';
import biodiversity3 from 'pages/topics/assets/biodiversity/slides/biodiversity3.png?webp';
import biodiversity3Large from 'pages/topics/assets/biodiversity/slides/biodiversity3@2x.png?webp';
import biodiversity4 from 'pages/topics/assets/biodiversity/slides/biodiversity4.png?webp';
import biodiversity4Large from 'pages/topics/assets/biodiversity/slides/biodiversity4@2x.png?webp';

// cards
import investigate from 'pages/topics/assets/biodiversity/cards/investigate.png?webp';
import investigateLarge from 'pages/topics/assets/biodiversity/cards/investigate@2x.png?webp';
import explore from 'pages/topics/assets/biodiversity/cards/explore.png?webp';
import exploreLarge from 'pages/topics/assets/biodiversity/cards/explore@2x.png?webp';
import tigers from 'pages/topics/assets/biodiversity/cards/tigers.png?webp';
import tigersLarge from 'pages/topics/assets/biodiversity/cards/tigers@2x.png?webp';

// animations
import scene1 from 'pages/topics/assets/biodiversity/animations/scene1.json';
import birds1 from 'pages/topics/assets/biodiversity/animations/birds1.json';
import scene2 from 'pages/topics/assets/biodiversity/animations/scene2.json';
import birds2 from 'pages/topics/assets/biodiversity/animations/birds2.json';
import scene3 from 'pages/topics/assets/biodiversity/animations/scene3.json';
import scene4 from 'pages/topics/assets/biodiversity/animations/scene4.json';
import birds4 from 'pages/topics/assets/biodiversity/animations/birds4.json';

export default {
  intro: {
    title: '80% of terrestrial species live in forests.',
    text:
      'We are currently undergoing the sixth great mass extinction of species. Human activity is driving extinction at a rate 1,000 to 10,000 times beyond natural levels. Protecting forest habitats is key to protecting our planet’s remaining biodiversity.',
    img1x: intro1x,
    img2x: intro2x,
  },
  slides: [
    {
      title: 'Biodiversity',
      subtitle: 'Natural state',
      text:
        'Forests are critical homes to plant and animal species. In turn, species that live within forests play an important role in maintaining forest health.',
      img1x: biodiversity1,
      img2x: biodiversity1Large,
      prompts: [
        {
          id: 'bio-learn',
          content: 'GFW helps visualize areas most important for biodiversity.',
          btnText: 'Explore the data',
          link: `/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiJhNjg0YTliYi02M2YyLTRiZWEtYmY2Mi1mZDVlODBkMjNkNzUiLCJsYXllcnMiOlsiZGZkOWRlYjYtOGQzOS00NjQwLTg1NzEtNDM4OWQ1ZDg4OThhIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6ImZlZTVmYzM4LTdhNjItNDliOC04ODc0LWRmYTMxY2JiMWVmNiIsImxheWVycyI6WyI0M2EyMDVmZS1hYWQzLTRkYjEtODgwNy1jMzk5YTMyNjQzNDkiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZX0%3D&menu=eyJtZW51U2VjdGlvbiI6IiJ9`,
          position: [65, 38],
        },
      ],
      animations: [
        {
          id: 'bio-scene1',
          data: scene1,
        },
        {
          id: 'bio-birds1',
          data: birds1,
          behind: true,
        },
      ],
    },
    {
      title: 'Biodiversity',
      subtitle: 'Drivers of change',
      text:
        'Changes to forested habitats can lead to the extinction of the species that depend on them. With fewer species, the resilience of the entire food chain suffers.',
      img1x: biodiversity2,
      img2x: biodiversity2Large,
      prompts: [
        {
          id: 'bio-learn',
          content:
            'GFW shows the current status of ecological areas as compared to their natural, undisturbed state.',
          btnText: 'Explore the data',
          link: `/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiJmZWU1ZmMzOC03YTYyLTQ5YjgtODg3NC1kZmEzMWNiYjFlZjYiLCJsYXllcnMiOlsiZjEzZjg2Y2ItMDhiNS00ZTZjLWJiOGQtYjQ3ODIwNTJmOWU1Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XSwiYmFzZW1hcCI6eyJ2YWx1ZSI6ImRlZmF1bHQifSwibGFiZWwiOiJkZWZhdWx0IiwiY2FuQm91bmQiOmZhbHNlLCJiYm94IjpudWxsfQ%3D%3D&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9`,
          position: [80, 60],
        },
      ],
      animations: [
        {
          id: 'bio-scene2',
          data: scene2,
        },
        {
          id: 'bio-birds2',
          data: birds2,
          behind: true,
        },
      ],
    },
    {
      title: 'Biodiversity',
      subtitle: 'Compromised state',
      text:
        'Failure to protect critical wildlife areas from deforestation means the loss of biodiversity and extinction of endangered species.',
      img1x: biodiversity3,
      img2x: biodiversity3Large,
      prompts: [
        {
          id: 'bio-status',
          content:
            'Learn how the loss of Intact Forest Landscapes affects biodiversity.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/data/worlds-last-intact-forests-are-becoming-increasingly-fragmented',
          position: [38, 45],
        },
      ],
      animations: [
        {
          id: 'bio-scene3',
          data: scene3,
        },
      ],
    },
    {
      title: 'Biodiversity',
      subtitle: 'Recovery state',
      text:
        'Protecting forest habitats is key to maintaining biodiversity. With better data on where tree cover loss in important biodiversity areas is happening, governments can make more informed decisions related to concessions and conservation projects and civil society can call attention to areas at risk.',
      img1x: biodiversity4,
      img2x: biodiversity4Large,
      prompts: [
        {
          id: 'bio-learn',
          content:
            'Read how GFW data help protect the Leuser Ecosystem in Indonesia.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/uncategorized/glad-alerts-help-protect-sumatras-leuser-rainforest-ecosystem',
          position: [35, 55],
        },
      ],
      animations: [
        {
          id: 'bio-scene4',
          data: scene4,
        },
        {
          id: 'bio-birds4',
          data: birds4,
          behind: true,
        },
      ],
    },
  ],
  cards: [
    {
      id: 'alerts',
      title: 'Investigate and monitor biodiversity areas',
      summary:
        'View recent deforestation alerts and satellite imagery and subscribe to alerts',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0Ijo1LjM1MzUyMTM1NTMzNzMzNCwibG5nIjotMi40NjA5Mzc1MDAwMDAwMDA0fSwiem9vbSI6MywiZGF0YXNldHMiOlt7ImRhdGFzZXQiOiJlNjYzZWIwOS0wNGRlLTRmMzktYjg3MS0zNWM2YzJlZDEwYjUiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiZGQ1ZGY4N2YtMzljMi00YWViLWE0NjItM2VmOTY5YjIwYjY2Il19LHsiZGF0YXNldCI6IjNiMTJjYzVmLTRiZjgtNDg1Ny05MDllLWE4NzkxMTI1YmJmMSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmZGZkNDI2Yi0xMWQwLTQ1ZmMtOTFmNC0zNzA2ZWJiMGU3OTgiXX0seyJkYXRhc2V0IjoiM2E2MzgxMDItYWI1MC00NzE3LWEwZmUtYjI3YmQ3OWQxOGMyIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbIjNjNDRkYThmLTE1OWEtNDFmMi05ZmRiLTQ0OGU0Y2QwOTIzZCJdfSx7ImRhdGFzZXQiOiJmZGM4ZGMxYi0yNzI4LTRhNzktYjIzZi1iMDk0ODUwNTJiOGQiLCJsYXllcnMiOlsiNmY2Nzk4ZTYtMzllYy00MTYzLTk3OWUtMTgyYTc0Y2E2NWVlIiwiYzVkMWUwMTAtMzgzYS00NzEzLTlhYWEtNDRmNzI4YzA1NzFjIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XSwiYmFzZW1hcCI6eyJ2YWx1ZSI6ImRlZmF1bHQifSwibGFiZWwiOiJkZWZhdWx0IiwiY2FuQm91bmQiOmZhbHNlLCJiYm94IjpudWxsfQ%3D%3D&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFuYWx5emVBbkFyZWEiLCJzdGVwSW5kZXgiOjB9',
      img1x: investigate,
      img2x: investigateLarge,
      btnText: 'view on map',
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
      btnText: 'view on map',
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
      btnText: 'view on map',
    },
    {
      id: 'feedback',
      title:
        'What other biodiversity data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      theme: 'theme-card-dark',
      btnText: 'feedback',
    },
  ],
};
