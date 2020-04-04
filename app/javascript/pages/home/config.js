import forestWatcherIcon from 'assets/icons/forest-watcher.svg?sprite';
import firesIcon from 'assets/icons/fires-flame.svg?sprite';
import proIcon from 'assets/icons/gfw-pro.svg?sprite';

import conservationOrgs from './assets/conservation-orgs.jpg?webp';
import policyMakers from './assets/policy-makers.jpg?webp';
import journalists from './assets/journalists.jpg?webp';
import company from './assets/company.jpg?webp';

import card1 from './assets/card-0.png?webp';
import card2 from './assets/card-1.png?webp';
import card3 from './assets/card-2.png?webp';
import card4 from './assets/card-3.png?webp';
import card5 from './assets/card-4.png?webp';

import forestWatcherImage from './assets/forestwatcher@2x.jpg?webp';
import firesImage from './assets/fires@2x.jpg?webp';
import proImage from './assets/pro-bg@2x.png?webp';

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
    },
    {
      title: 'Forest insights',
      summary:
        'Read the latest stories and findings about forests from our team of researchers on the GFW blog.',
      buttons: [
        {
          text: 'START LEARNING',
          extLink: 'https://blog.globalforestwatch.org/',
        },
      ],
      image: card4,
    },
    {
      title: 'A suite of tools',
      summary:
        'Find out about the connections between deforestation and climate change, fires and haze, water security, and commodity supply chains with our specialized web applications.',
      buttons: [
        {
          text: 'BROWSE OUR APPS',
          extLink: 'https://developers.globalforestwatch.org',
        },
      ],
      image: card5,
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
      title: 'Fires',
      description:
        'Track fires and haze, view the latest data on fire locations and air quality, and do your own analysis',
      background: firesImage,
      extLink: 'https://fires.globalforestwatch.org',
      color: '#F71949',
      icon: firesIcon,
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
