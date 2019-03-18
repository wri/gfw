import investigateImage from 'pages/topics/assets/commodities/cards/investigate.png';
import exploreImage from 'pages/topics/assets/commodities/cards/explore.png';
import learnImage from 'pages/topics/assets/commodities/cards/learn.png';
import digger from 'pages/topics/assets/commodities/commodities-intro.svg';

export default {
  intro: {
    img: digger,
    title: '27% of global deforestation is commodity-driven.',
    text:
      'Production of commodities including beef, soy, palm oil, pulp, paper, energy and minerals, is the leading cause of deforestation. More sustainable commodity production is critical for conserving forests and mitigating climate change.'
  },
  slides: [
    {
      title: 'Commodities',
      subtitle: 'Ideal state',
      text:
        'Societies around the world have relied on nearby forests for food, fuel and medicine for thousands of years. Traditional practices like agroforestry, and small-scale and shifting agriculture had a reduced impact on the surrounding environment and generated socioeconomic benefits for local communities.',
      src: 'commodities1',
      prompts: [
        {
          id: 'comms-learn',
          content:
            'Learn about the differences beteween traditional cultivation practices and deforestation.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/data/new-map-helps-distinguish-between-cyclical-farming-and-deforestation-in-the-congo-basin',
          position: [35, 82]
        }
      ]
    },
    {
      title: 'Commodities',
      subtitle: 'Drivers of change',
      text:
        'As demand for commodities grows, deforestation from industrial-scale agriculture, illegal harvesting of timber and mining increases. The inability to track where products come from and a lack of consequences for environmental outcomes make it difficult to curb the impacts of these industries.',
      src: 'commodities2',
      prompts: [
        {
          id: 'comms-learn',
          content: 'Read about the links between fires a commodity production.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/fires/after-record-breaking-fires-can-indonesias-new-policies-turn-down-the-heat',
          position: [65, 52]
        },
        {
          id: 'comms-explore',
          content:
            'GFW maps concession boundaries alongside primary, intact and peat forest to highlight areas most at risk of commodity-driven deforestation.',
          btnText: 'Explore the data',
          link:
            '/map?map=eyJ6b29tIjoyLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImNhbkJvdW5kIjp0cnVlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImFlMWU0ODVhLTViMzktNDNiMy05YTRlLTBlZGMzOGZkMTFhNiIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyIzZjBhYWM0YS03Y2NhLTRiNzctOWEwMS05NWZjZjVlOThjYzAiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiI3MTQzMzljMS1jNzc1LTQzMDMtYWFkNC0xNmQ5NzViMmYwMjMiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiMDc5ZmFlMDgtNTY5Ni00OTI2LTk0MTctNzk0YmQzYTdlOGRjIl19LHsiZGF0YXNldCI6IjEzZTI4NTUwLTNmYzktNDVlYy1iYjAwLTVhNDhhODJiNzdlMSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmZDQ0Yjk3Ni02MmU2LTQwNzItODIxOC04YWJmNmUyNTRlZDgiXX1dfQ%3D%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6InNlYXJjaCIsInNlYXJjaCI6IiJ9',
          position: [33, 75]
        }
      ]
    },
    {
      title: 'Commodities',
      subtitle: 'Compromised state',
      text:
        'The unsustainable expansion of commodity production can permanently damage ecosystems, displace local communities, exacerbate climate change, and accelerate biodiversity loss.',
      src: 'commodities3',
      prompts: [
        {
          id: 'comms-data',
          content: 'GFW data show commodity-driven deforestation.',
          btnText: 'Explore the data',
          link:
            '/map?map=eyJ6b29tIjoyLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImNhbkJvdW5kIjp0cnVlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6Ijg5NzU1YjlmLWRmMDUtNGUyMi1hOWJjLTA1MjE3YzhlYWZjOCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmZDA1YmMyYy02YWRlLTQwOGMtODYyZS03MzE4NTU3ZGQ0ZmMiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6IiIsInNlYXJjaCI6IiJ9',
          position: [75, 58]
        },
        {
          id: 'comms-read',
          content:
            'Read how indigenous communities are using GFW data to monitor and protect their land.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/gfw-community/smart-phones-and-satellite-imagery-indigenous-communities-solution-to-protect-the-peruvian-rainforest',
          position: [40, 60]
        }
      ]
    },
    {
      title: 'Commodities',
      subtitle: 'Recovery state',
      text:
        'Deforestation-free commodity production is possible. Improved forest monitoring can help companies make more sustainable purchasing decisions, faciliate action against illegal clearing and enable policymakers to create more informed land use allocations.',
      src: 'commodities4',
      prompts: [
        {
          id: 'comms-pro',
          content:
            'GFW Pro helps companies manage deforestation risk within their supply chains.',
          btnText: 'Explore GFW Pro',
          link: 'https://pro.globalforestwatch.org',
          position: [63, 43]
        },
        {
          id: 'comms-read',
          content:
            "Learn why deforestation-free supply chains are better for companies' bottom lines.",
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/supplychain/how-big-data-and-satellites-can-help-banks-tackle-deforestation',
          position: [35, 72]
        }
      ]
    }
  ],
  cards: [
    {
      id: 'map',
      title: 'Explore data on the map',
      summary: 'View commodity production areas, tree cover loss and more.',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiI3YTRkOWE2NC1lY2IxLTQ1ZWMtYTAxZS02NThmMTM2NGZiMmUiLCJsYXllcnMiOlsiZmNkMTAwMjYtZTg5Mi00ZmI4LThkNzktOGQ3NmUzYjk0MDA1Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6IjRmYzI0YTAzLWNiM2UtNGRmMy1hMmVlLWUyYThkY2EzNDJiMyIsImxheWVycyI6WyJjMjZkYjQxYS1iNTg2LTQ2MWMtYjY0OC05MzIwNWVhZmVhMGIiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiYzRkNGUwN2MtYzViNC00ZTJjLTlkYjEtNWMzYmVjMTg1ZjBlIiwibGF5ZXJzIjpbIjA5MTFhYmM0LWQ4NjEtNGQ3YS04NGQ2LTBmYTA3YjUxZDdkOCJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiI5M2U2N2E3Ny0xYTMxLTRkMDQtYTc1ZC04NmE0ZDZlMzVkNTQiLCJsYXllcnMiOlsiZjY4MDgyOGUtYmU2OC00ODk1LWIxZWQtMWQwOTE1ZDA3NDU3Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6Ijg5N2VjYzc2LTIzMDgtNGM1MS1hZWIzLTQ5NWRlMGJkY2E3OSIsImxheWVycyI6WyJjMzA3NWM1YS01NTY3LTRiMDktYmMwZC05NmVkMTY3M2Y4YjYiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZX0%3D&menu=eyJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIiwiZGF0YXNldENhdGVnb3J5IjoibGFuZFVzZSJ9',
      image: exploreImage,
      btnText: 'view on map'
    },
    {
      id: 'analysis',
      title: 'Investigate and monitor commodity production areas',
      summary:
        'View recent deforestation alerts and satellite imagery and and subscribe to alerts.',
      link:
        '/map?map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImU2NjNlYjA5LTA0ZGUtNGYzOS1iODcxLTM1YzZjMmVkMTBiNSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJkZDVkZjg3Zi0zOWMyLTRhZWItYTQ2Mi0zZWY5NjliMjBiNjYiXX0seyJkYXRhc2V0IjoiOTNlNjdhNzctMWEzMS00ZDA0LWE3NWQtODZhNGQ2ZTM1ZDU0Iiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImY2ODA4MjhlLWJlNjgtNDg5NS1iMWVkLTFkMDkxNWQwNzQ1NyJdfSx7ImRhdGFzZXQiOiI3YTRkOWE2NC1lY2IxLTQ1ZWMtYTAxZS02NThmMTM2NGZiMmUiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiZmNkMTAwMjYtZTg5Mi00ZmI4LThkNzktOGQ3NmUzYjk0MDA1Il19LHsiZGF0YXNldCI6ImM0ZDRlMDdjLWM1YjQtNGUyYy05ZGIxLTVjM2JlYzE4NWYwZSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyIwOTExYWJjNC1kODYxLTRkN2EtODRkNi0wZmEwN2I1MWQ3ZDgiXX0seyJkYXRhc2V0IjoiNGZjMjRhMDMtY2IzZS00ZGYzLWEyZWUtZTJhOGRjYTM0MmIzIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImMyNmRiNDFhLWI1ODYtNDYxYy1iNjQ4LTkzMjA1ZWFmZWEwYiJdfSx7ImRhdGFzZXQiOiJmZGM4ZGMxYi0yNzI4LTRhNzktYjIzZi1iMDk0ODUwNTJiOGQiLCJsYXllcnMiOlsiNmY2Nzk4ZTYtMzllYy00MTYzLTk3OWUtMTgyYTc0Y2E2NWVlIiwiYzVkMWUwMTAtMzgzYS00NzEzLTlhYWEtNDRmNzI4YzA1NzFjIl0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9XSwiY2FuQm91bmQiOmZhbHNlLCJ6b29tIjozLCJjZW50ZXIiOnsibGF0IjoxMS40MzY5NTUyMTYxNDMxOSwibG5nIjoyNC4yNTc4MTI1MDAwMDAwMDR9LCJiYm94IjpudWxsfQ%3D%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6IiJ9',
      image: investigateImage,
      btnText: 'view on map'
    },
    {
      id: 'learn',
      title: 'Learn more',
      summary: 'Read about forests and commodities on the GFW blog.',
      extLink: 'https://blog.globalforestwatch.org',
      image: learnImage,
      btnText: 'read the blog'
    },
    {
      id: 'feedback',
      title:
        'What other commodities data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      extLink: '',
      theme: 'theme-card-dark',
      btnText: 'feedback'
    }
  ]
};
