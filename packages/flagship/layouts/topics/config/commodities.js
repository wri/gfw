// intro
import intro1x from 'pages/topics/assets/commodities/intro/truck.png?webp';
import intro2x from 'pages/topics/assets/commodities/intro/truck@2x.png?webp';

// slides
import commodities1 from 'pages/topics/assets/commodities/slides/commodities1.png?webp';
import commodities1Large from 'pages/topics/assets/commodities/slides/commodities1@2x.png?webp';
import commodities2 from 'pages/topics/assets/commodities/slides/commodities2.png?webp';
import commodities2Large from 'pages/topics/assets/commodities/slides/commodities2@2x.png?webp';
import commodities3 from 'pages/topics/assets/commodities/slides/commodities3.png?webp';
import commodities3Large from 'pages/topics/assets/commodities/slides/commodities3@2x.png?webp';
import commodities4 from 'pages/topics/assets/commodities/slides/commodities4.png?webp';
import commodities4Large from 'pages/topics/assets/commodities/slides/commodities4@2x.png?webp';

// cards
import investigate from 'pages/topics/assets/commodities/cards/investigate.png?webp';
import investigateLarge from 'pages/topics/assets/commodities/cards/investigate@2x.png?webp';
import pro from 'pages/topics/assets/commodities/cards/pro.png?webp';
import proLarge from 'pages/topics/assets/commodities/cards/pro@2x.png?webp';
import explore from 'pages/topics/assets/commodities/cards/explore.png?webp';
import exploreLarge from 'pages/topics/assets/commodities/cards/explore@2x.png?webp';
import learn from 'pages/topics/assets/commodities/cards/learn.png?webp';
import learnLarge from 'pages/topics/assets/commodities/cards/learn@2x.png?webp';

// animations
import birds1 from 'pages/topics/assets/commodities/animations/birds1.json';
import scene2 from 'pages/topics/assets/commodities/animations/scene2.json';
import scene3 from 'pages/topics/assets/commodities/animations/scene3.json';
import birds4 from 'pages/topics/assets/commodities/animations/birds4.json';

export default {
  intro: {
    title: '40% of global deforestation is commodity-driven.',
    text:
      'Production of commodities including beef, soy, palm oil, pulp, paper, energy and minerals, is the leading cause of deforestation. More sustainable commodity production is critical for conserving forests and mitigating climate change.',
    citation: 'https://iopscience.iop.org/article/10.1088/1748-9326/7/4/044009',
    img1x: intro1x,
    img2x: intro2x,
  },
  slides: [
    {
      title: 'Commodities',
      subtitle: 'Natural state',
      text:
        'Societies around the world have relied on nearby forests for food, fuel and medicine for thousands of years. Traditional practices like agroforestry, and small-scale and shifting agriculture had a reduced impact on the surrounding environment and generated socioeconomic benefits for local communities.',
      img1x: commodities1,
      img2x: commodities1Large,
      prompts: [
        {
          id: 'comms-learn',
          content:
            'Learn about the differences beteween traditional cultivation practices and deforestation.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/data/new-map-helps-distinguish-between-cyclical-farming-and-deforestation-in-the-congo-basin',
          position: [35, 82],
        },
      ],
      animations: [
        {
          id: 'commodities-birds1',
          data: birds1,
          behind: true,
        },
      ],
    },
    {
      title: 'Commodities',
      subtitle: 'Drivers of change',
      text:
        'As demand for commodities grows, deforestation from industrial-scale agriculture, illegal harvesting of timber and mining increases. The inability to track where products come from and a lack of consequences for environmental outcomes make it difficult to curb the impacts of these industries.',
      img1x: commodities2,
      img2x: commodities2Large,
      prompts: [
        {
          id: 'comms-learn',
          content: 'Read about the links between fires a commodity production.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/fires/after-record-breaking-fires-can-indonesias-new-policies-turn-down-the-heat',
          position: [65, 52],
        },
        {
          id: 'comms-explore',
          content:
            'GFW maps concession boundaries alongside primary, intact and peat forest to highlight areas most at risk of commodity-driven deforestation.',
          btnText: 'Explore the data',
          link: `/map?map=eyJ6b29tIjoyLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImNhbkJvdW5kIjp0cnVlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImZkYzhkYzFiLTI3MjgtNGE3OS1iMjNmLWIwOTQ4NTA1MmI4ZCIsImxheWVycyI6WyI2ZjY3OThlNi0zOWVjLTQxNjMtOTc5ZS0xODJhNzRjYTY1ZWUiLCJjNWQxZTAxMC0zODNhLTQ3MTMtOWFhYS00NGY3MjhjMDU3MWMiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiOTNlNjdhNzctMWEzMS00ZDA0LWE3NWQtODZhNGQ2ZTM1ZDU0Iiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImY2ODA4MjhlLWJlNjgtNDg5NS1iMWVkLTFkMDkxNWQwNzQ1NyJdfSx7ImRhdGFzZXQiOiJjNGQ0ZTA3Yy1jNWI0LTRlMmMtOWRiMS01YzNiZWMxODVmMGUiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiMDkxMWFiYzQtZDg2MS00ZDdhLTg0ZDYtMGZhMDdiNTFkN2Q4Il19LHsiZGF0YXNldCI6IjdhNGQ5YTY0LWVjYjEtNDVlYy1hMDFlLTY1OGYxMzY0ZmIyZSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmY2QxMDAyNi1lODkyLTRmYjgtOGQ3OS04ZDc2ZTNiOTQwMDUiXX0seyJkYXRhc2V0IjoiNGZjMjRhMDMtY2IzZS00ZGYzLWEyZWUtZTJhOGRjYTM0MmIzIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImMyNmRiNDFhLWI1ODYtNDYxYy1iNjQ4LTkzMjA1ZWFmZWEwYiJdfSx7ImRhdGFzZXQiOiI3MTQzMzljMS1jNzc1LTQzMDMtYWFkNC0xNmQ5NzViMmYwMjMiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiMDc5ZmFlMDgtNTY5Ni00OTI2LTk0MTctNzk0YmQzYTdlOGRjIl19LHsiZGF0YXNldCI6IjEzZTI4NTUwLTNmYzktNDVlYy1iYjAwLTVhNDhhODJiNzdlMSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmZDQ0Yjk3Ni02MmU2LTQwNzItODIxOC04YWJmNmUyNTRlZDgiXX0seyJkYXRhc2V0IjoiNzU5ZGU0OWMtYTU5OS00MzY5LTgyMWEtOGQyNzM1MGIwMzkzIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImVlMWM1NmNiLTY0MTgtNDAyOS04ZDBiLTFiM2FlOTY2MDdmZSJdLCJpc28iOiJNWVMifSx7ImRhdGFzZXQiOiIzMTAzMDc1ZS02NGQ0LTRhNTItODNhMy0xMDk0Y2Y5Y2YwNGEiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiMTk3Nzg0OTQtYjhlZS00NDM2LTliOGMtY2VhMTk4NzNiY2M1Il0sImlzbyI6IklETiJ9XX0%3D&mapPrompts=eyJzdGVwc0tleSI6InJlY2VudEltYWdlcnkiLCJzdGVwc0luZGV4IjowLCJvcGVuIjpmYWxzZSwic3RlcEluZGV4IjowfQ%3D%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6IiIsInNlYXJjaCI6IiIsInNlbGVjdGVkQ291bnRyaWVzIjpbIklETiIsIk1ZUyJdfQ%3D%3D`,
          position: [33, 75],
        },
      ],
      animations: [
        {
          id: 'commodities-scene2',
          data: scene2,
        },
      ],
    },
    {
      title: 'Commodities',
      subtitle: 'Compromised state',
      text:
        'The unsustainable expansion of commodity production can permanently damage ecosystems, displace local communities, exacerbate climate change and accelerate biodiversity loss.',
      img1x: commodities3,
      img2x: commodities3Large,
      prompts: [
        {
          id: 'comms-data',
          content: 'GFW data show commodity-driven deforestation.',
          btnText: 'Explore the data',
          link: `/map?map=eyJ6b29tIjoyLCJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImNhbkJvdW5kIjp0cnVlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6Ijg5NzU1YjlmLWRmMDUtNGUyMi1hOWJjLTA1MjE3YzhlYWZjOCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmZDA1YmMyYy02YWRlLTQwOGMtODYyZS03MzE4NTU3ZGQ0ZmMiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6IiIsInNlYXJjaCI6IiJ9`,
          position: [75, 58],
        },
        {
          id: 'comms-read',
          content:
            'Read how indigenous communities are using GFW data to monitor and protect their land.',
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/gfw-community/smart-phones-and-satellite-imagery-indigenous-communities-solution-to-protect-the-peruvian-rainforest',
          position: [40, 60],
        },
      ],
      animations: [
        {
          id: 'commodities-scene3',
          data: scene3,
        },
      ],
    },
    {
      title: 'Commodities',
      subtitle: 'Recovery state',
      text:
        'Deforestation-free commodity production is possible. Improved forest monitoring can help companies make more sustainable purchasing decisions, facilitate action against illegal clearing and enable policymakers to create more informed land use allocations.',
      img1x: commodities4,
      img2x: commodities4Large,
      prompts: [
        {
          id: 'comms-pro',
          content:
            'GFW Pro helps companies manage deforestation risk within their supply chains.',
          btnText: 'Explore GFW Pro',
          link: 'https://pro.globalforestwatch.org',
          position: [63, 43],
        },
        {
          id: 'comms-read',
          content:
            "Learn why deforestation-free supply chains are better for companies' bottom lines.",
          btnText: 'Read the blog',
          link:
            'https://blog.globalforestwatch.org/supplychain/how-big-data-and-satellites-can-help-banks-tackle-deforestation',
          position: [35, 72],
        },
      ],
      animations: [
        {
          id: 'commodities-birds4',
          data: birds4,
          behind: true,
        },
      ],
    },
  ],
  cards: [
    {
      id: 'map',
      title: 'Explore data on the map',
      summary: 'View commodity production areas, tree cover loss and more.',
      link:
        '/map?map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sInpvb20iOjIsImRhdGFzZXRzIjpbeyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiI3YTRkOWE2NC1lY2IxLTQ1ZWMtYTAxZS02NThmMTM2NGZiMmUiLCJsYXllcnMiOlsiZmNkMTAwMjYtZTg5Mi00ZmI4LThkNzktOGQ3NmUzYjk0MDA1Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6IjRmYzI0YTAzLWNiM2UtNGRmMy1hMmVlLWUyYThkY2EzNDJiMyIsImxheWVycyI6WyJjMjZkYjQxYS1iNTg2LTQ2MWMtYjY0OC05MzIwNWVhZmVhMGIiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiYzRkNGUwN2MtYzViNC00ZTJjLTlkYjEtNWMzYmVjMTg1ZjBlIiwibGF5ZXJzIjpbIjA5MTFhYmM0LWQ4NjEtNGQ3YS04NGQ2LTBmYTA3YjUxZDdkOCJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfSx7ImRhdGFzZXQiOiI5M2U2N2E3Ny0xYTMxLTRkMDQtYTc1ZC04NmE0ZDZlMzVkNTQiLCJsYXllcnMiOlsiZjY4MDgyOGUtYmU2OC00ODk1LWIxZWQtMWQwOTE1ZDA3NDU3Il0sIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWV9LHsiZGF0YXNldCI6Ijg5N2VjYzc2LTIzMDgtNGM1MS1hZWIzLTQ5NWRlMGJkY2E3OSIsImxheWVycyI6WyJjMzA3NWM1YS01NTY3LTRiMDktYmMwZC05NmVkMTY3M2Y4YjYiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX1dLCJiYXNlbWFwIjp7InZhbHVlIjoiZGVmYXVsdCJ9LCJsYWJlbCI6ImRlZmF1bHQiLCJjYW5Cb3VuZCI6dHJ1ZX0%3D&menu=eyJtZW51U2VjdGlvbiI6IiJ9',
      img1x: explore,
      img2x: exploreLarge,
      btnText: 'view on map',
    },
    {
      id: 'analysis',
      title: 'Investigate and monitor commodity production areas',
      summary:
        'View recent deforestation alerts and satellite imagery and and subscribe to alerts.',
      link:
        '/map?map=eyJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImZkYzhkYzFiLTI3MjgtNGE3OS1iMjNmLWIwOTQ4NTA1MmI4ZCIsImxheWVycyI6WyI2ZjY3OThlNi0zOWVjLTQxNjMtOTc5ZS0xODJhNzRjYTY1ZWUiLCJjNWQxZTAxMC0zODNhLTQ3MTMtOWFhYS00NGY3MjhjMDU3MWMiXSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiZTY2M2ViMDktMDRkZS00ZjM5LWI4NzEtMzVjNmMyZWQxMGI1Iiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImRkNWRmODdmLTM5YzItNGFlYi1hNDYyLTNlZjk2OWIyMGI2NiJdfSx7ImRhdGFzZXQiOiJmOGM3N2EzMy1kNmVhLTQ3OGItOWFjZC0yMDQ3Yjc1YjBjYjgiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiNDQ0ZDlmODAtZmI0ZC00ZDU3LWEzYTctNjk5OGFlNTZlZmJkIl19LHsiZGF0YXNldCI6ImRhOWI5MmRkLWNjZGMtNDRlMS05ZGZkLTZlODI2OGUzNmRkMCIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyIyZTJhOWJmNS1jY2U1LTQzMzctYjQxNi1iM2ZiOTZjNmM0NmYiXX0seyJkYXRhc2V0IjoiOTNlNjdhNzctMWEzMS00ZDA0LWE3NWQtODZhNGQ2ZTM1ZDU0Iiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImY2ODA4MjhlLWJlNjgtNDg5NS1iMWVkLTFkMDkxNWQwNzQ1NyJdfSx7ImRhdGFzZXQiOiJjNGQ0ZTA3Yy1jNWI0LTRlMmMtOWRiMS01YzNiZWMxODVmMGUiLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJsYXllcnMiOlsiMDkxMWFiYzQtZDg2MS00ZDdhLTg0ZDYtMGZhMDdiNTFkN2Q4Il19LHsiZGF0YXNldCI6IjdhNGQ5YTY0LWVjYjEtNDVlYy1hMDFlLTY1OGYxMzY0ZmIyZSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJmY2QxMDAyNi1lODkyLTRmYjgtOGQ3OS04ZDc2ZTNiOTQwMDUiXX0seyJkYXRhc2V0IjoiNGZjMjRhMDMtY2IzZS00ZGYzLWEyZWUtZTJhOGRjYTM0MmIzIiwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZSwibGF5ZXJzIjpbImMyNmRiNDFhLWI1ODYtNDYxYy1iNjQ4LTkzMjA1ZWFmZWEwYiJdfV0sImNhbkJvdW5kIjpmYWxzZSwiem9vbSI6MiwiY2VudGVyIjp7ImxhdCI6OS44ODIyNzU0OTM0MDIxMDMsImxuZyI6LTIxLjk3MjY1NjI1MDAxNDA5fSwiYmJveCI6bnVsbH0%3D&menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiIiLCJtZW51U2VjdGlvbiI6IiJ9&modalMeta=eyJtZXRha2V5IjoiIiwibWV0YVdoaXRlbGlzdCI6W10sInRhYmxlV2hpdGVsaXN0IjpbXSwiY2l0YXRpb24iOiIifQ%3D%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFuYWx5emVBbkFyZWEiLCJzdGVwSW5kZXgiOjB9',
      img1x: investigate,
      img2x: investigateLarge,
      btnText: 'view on map',
    },
    {
      id: 'pro',
      title: 'Utilize GFW Pro',
      summary:
        'A new application for companies and financial institutions to securely manage deforestation risk in commodity supply chains.',
      extLink: 'https://pro.globalforestwatch.org',
      img1x: pro,
      img2x: proLarge,
      btnText: 'go to pro',
    },
    {
      id: 'learn',
      title: 'Learn more',
      summary: 'Read about forests and commodities on the GFW blog.',
      extLink: 'https://blog.globalforestwatch.org/commodities',
      img1x: learn,
      img2x: learnLarge,
      btnText: 'read the blog',
    },
    {
      id: 'feedback',
      title:
        'What other commodities data and analysis would you like to see on GFW?',
      summary: 'Tell us!',
      extLink: '',
      theme: 'theme-card-dark',
      btnText: 'feedback',
    },
  ],
};
