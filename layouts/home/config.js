import forestWatcherIcon from 'assets/icons/forest-watcher.svg';
import proIcon from 'assets/icons/gfw-pro.svg';

import conservationOrgs from './assets/conservation-orgs.jpg';
import policyMakers from './assets/policy-makers.jpg';
import journalists from './assets/journalists.jpg';
import company from './assets/company.jpg';

import card1 from './assets/card-0.png';
import card1Webp from './assets/card-0.webp';
import card2 from './assets/card-1.png';
import card2Webp from './assets/card-1.webp';
import card3 from './assets/card-2.png';
import card3Webp from './assets/card-2.webp';
import card4 from './assets/card-3.png';
import card4Webp from './assets/card-3.webp';
import card5 from './assets/card-4.png';
import card5Webp from './assets/card-4.webp';
import card6 from './assets/card-5.png';
import card6Webp from './assets/card-5.webp';

import forestWatcherImage from './assets/forestwatcher@2x.jpg';
import proImage from './assets/pro-bg@2x.png';

export default {
  summary: [
    {
      title: 'Discover the world’s forests through data',
      summary:
        'Explore over 100 global and local data sets to learn about conservation, land use, forest communities, and much more.',
      buttons: [
        {
          text: 'EXPLORE OUR DATA',
          link:
            '/map?menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UiLCJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIn0%3D',
        },
      ],
      image: card1,
      webPImage: card1Webp,
    },
    {
      title: 'Be the first to see new tropical deforestation',
      summary:
        'View, analyze, and subscribe to get weekly GLAD deforestation alerts that show where tree cover loss is happening right now in the tropics.',
      buttons: [
        {
          text: 'VIEW GLAD ALERTS',
          link:
            '/map?analysis=eyJzaG93QW5hbHlzaXMiOnRydWUsImhpZGRlbiI6ZmFsc2V9&map=eyJ6b29tIjozLCJjZW50ZXIiOnsibGF0IjotNC4yMTQ5NDMxNDEzOTA2MzksImxuZyI6LTUuODAwNzgxMjUwMDAwMDAxfSwiY2FuQm91bmQiOmZhbHNlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImU2NjNlYjA5LTA0ZGUtNGYzOS1iODcxLTM1YzZjMmVkMTBiNSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJkZDVkZjg3Zi0zOWMyLTRhZWItYTQ2Mi0zZWY5NjliMjBiNjYiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9',
        },
      ],
      image: card2,
      webPImage: card2Webp,
    },
    {
      title: 'Quick global and country stats',
      summary:
        'Analyze forest change and investigate trends anywhere in the world with just a few clicks.',
      buttons: [
        {
          text: 'EXPLORE THE DASHBOARDS',
          link: '/dashboards/global',
        },
      ],
      image: card3,
      webPImage: card3Webp,
    },
    {
      title: 'A suite of tools',
      summary:
        'Find out about the connections between deforestation and climate change, fires and haze, water security, and commodity supply chains with our specialized web applications.',
      buttons: [
        {
          text: 'BROWSE OUR APPS',
          extLink: 'https://www.globalforestwatch.org/help',
        },
      ],
      image: card5,
      webPImage: card5Webp,
    },
    {
      title: 'Read about the latest updates',
      summary:
        'Check out stories on data and tools, GFW users in the field, and findings from our team of researchers on the GFW blog.',
      buttons: [
        {
          text: 'START LEARNING',
          extLink: 'https://blog.globalforestwatch.org/',
        },
      ],
      image: card4,
      webPImage: card4Webp,
    },
    {
      title: 'The status of the world’s forests',
      summary:
        'Explore in-depth reporting and analysis on trends in tree cover loss and how forests are faring on the Global Forest Review.',
      buttons: [
        {
          text: 'EXPLORE THE GFR',
          extLink: 'https://research.wri.org/gfr/global-forest-review',
        },
      ],
      image: card6,
      webPImage: card6Webp,
    },
  ],
  uses: [
    {
      profile: 'Conservation Orgs',
      example:
        "The Amazon Conservation Association (ACA) works to protect biodiversity in the Amazon. With GLAD deforestation alerts on Global Forest Watch, we can detect illegal gold mining and logging in protected areas within days. By getting timely and precise information into the hands of policymakers, we've seen government authorities on the ground taking action within 24-48 hours of receiving an alert.",
      credit: {
        name: 'MINAMPERÚ',
        extLink: 'https://www.flickr.com/photos/minamperu/9966829933',
      },
      img: conservationOrgs,
    },
    {
      profile: 'Policymaker',
      example:
        'At the Forest Development Authority in Liberia, we saw a need to improve science-based decision making in forest resource management. We developed a Forest Atlas with Global Forest Watch that allows us to manage and share information about forest cover and land use. The Forest Atlas revolutionized how we communicate about the forest sector in Liberia.',
      credit: {
        name: 'Greenpeace International',
        extLink: 'http://www.greenpeace.org/',
      },
      img: policyMakers,
    },
    {
      profile: 'Journalist',
      example:
        "Mongabay is a science-based environmental news platform aiming to inspire, educate, and inform the public. The deforestation and fire alerts on GFW allow us to identify stories as they're happening on the ground. In Peru, we were able to track fires as they invaded protected areas and mobilize our Latin America team to get coverage. It added a really timely dimension to our reporting and led Peruvian officials to go out immediately and address the situation.",
      credit: {
        name: 'CIFOR',
        extLink: 'https://www.flickr.com/photos/cifor/16425898585',
      },
      img: journalists,
    },
    {
      profile: 'Company',
      example:
        'At Mars, deforestation poses a risk to our business – we don’t want our supply chains to be associated with serious environmental issues. We used the PALM risk tool on GFW Commodities to evaluate our palm oil suppliers and help us make decisions about where to source from. With GFW, we were able to turn concerns about deforestation into an actionable method for engaging our suppliers.',
      credit: {
        name: 'Marufish',
        extLink: 'https://www.flickr.com/photos/marufish/4074823996',
      },
      img: company,
    },
  ],
  apps: [
    {
      title: 'Forest Watcher',
      description:
        "Access GFW's forest monitoring and alert system offline and collect data from the field, all from your mobile device",
      background: forestWatcherImage,
      extLink: 'https://forestwatcher.globalforestwatch.org/',
      color: '#97be32',
      icon: forestWatcherIcon,
    },
    {
      title: 'GFW Pro',
      description:
        'Securely manage deforestation risk in commodity supply chains',
      background: proImage,
      extLink: 'https://pro.globalforestwatch.org',
      color: '#404042',
      icon: proIcon,
      className: 'pro',
    },
  ],
};
