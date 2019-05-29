import conservationOrgs from './assets/conservation-orgs.jpg';
import policyMakers from './assets/policy-makers.jpg';
import journalists from './assets/journalists.jpg';
import company from './assets/company.jpg';

export default {
  summary: [
    {
      title: 'Discover the world’s forests through data',
      summary:
        'Explore over 100 global and local data sets to learn about conservation, land use, forest communities, and much more.',
      buttons: [
        {
          text: 'EXPLORE OUR DATA',
          path:
            '/map?menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UiLCJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIn0%3D'
        }
      ]
    },
    {
      title: 'Be the first to see new tropical deforestation',
      summary:
        'View, analyze, and subscribe to get weekly GLAD deforestation alerts that show where tree cover loss is happening right now in the tropics.',
      buttons: [
        {
          text: 'VIEW GLAD ALERTS',
          path:
            '/map?analysis=eyJzaG93QW5hbHlzaXMiOnRydWUsImhpZGRlbiI6ZmFsc2V9&map=eyJ6b29tIjozLCJjZW50ZXIiOnsibGF0IjotNC4yMTQ5NDMxNDEzOTA2MzksImxuZyI6LTUuODAwNzgxMjUwMDAwMDAxfSwiY2FuQm91bmQiOmZhbHNlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImU2NjNlYjA5LTA0ZGUtNGYzOS1iODcxLTM1YzZjMmVkMTBiNSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJkZDVkZjg3Zi0zOWMyLTRhZWItYTQ2Mi0zZWY5NjliMjBiNjYiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9'
        }
      ]
    },
    {
      title: 'Quick global and country stats',
      summary:
        'Analyze forest change and investigate trends anywhere in the world with just a few clicks.',
      buttons: [
        {
          text: 'EXPLORE THE DASHBOARDS',
          path: '/dashboards/global'
        }
      ]
    },
    {
      title: 'Forest insights',
      summary:
        'Read the latest stories and findings about forests from our team of researchers on the GFW blog.',
      buttons: [
        {
          text: 'START LEARNING',
          extLink: 'https://blog.globalforestwatch.org/'
        }
      ]
    },
    {
      title: 'A suite of tools',
      summary:
        'Find out about the connections between deforestation and climate change, fires and haze, water security, and commodity supply chains with our specialized web applications.',
      buttons: [
        {
          text: 'BROWSE OUR APPS',
          extLink: 'https://developers.globalforestwatch.org'
        }
      ]
    }
  ],
  uses: [
    {
      profile: 'Conservation Orgs',
      example: "The Amazon Conservation Association (ACA) works to protect biodiversity in the Amazon. With GLAD deforestation alerts on Global Forest Watch, we can detect illegal gold mining and logging in protected areas within days. By getting timely and precise information into the hands of policymakers, we've seen government authorities on the ground taking action within 24-48 hours of receiving an alert.",
      credit: {
        name: 'MINAMPERÚ',
        extLink: 'https://www.flickr.com/photos/minamperu/9966829933'
      },
      img: conservationOrgs
    },
    {
      profile: 'Policymaker',
      example: 'At the Forest Development Authority in Liberia, we saw a need to improve science-based decision making in forest resource management. We developed a Forest Atlas with Global Forest Watch that allows us to manage and share information about forest cover and land use. The Forest Atlas revolutionized how we communicate about the forest sector in Liberia.',
      credit: {
        name: 'Greenpeace International',
        extLink: 'http://www.greenpeace.org/'
      },
      img: policyMakers
    },
    {
      profile: 'Journalist',
      example: "Mongabay is a science-based environmental news platform aiming to inspire, educate, and inform the public. The deforestation and fire alerts on GFW allow us to identify stories as they're happening on the ground. In Peru, we were able to track fires as they invaded protected areas and mobilize our Latin America team to get coverage. It added a really timely dimension to our reporting and led Peruvian officials to go out immediately and address the situation.",
      credit: {
        name: 'CIFOR',
        extLink: 'https://www.flickr.com/photos/cifor/16425898585'
      },
      img: journalists
    },
    {
      profile: 'Company',
      example: 'At Mars, deforestation poses a risk to our business – we don’t want our supply chains to be associated with serious environmental issues. We used the PALM risk tool on GFW Commodities to evaluate our palm oil suppliers and help us make decisions about where to source from. With GFW, we were able to turn concerns about deforestation into an actionable method for engaging our suppliers.',
      credit: {
        name: 'Marufish',
        extLink: 'https://www.flickr.com/photos/marufish/4074823996'
      },
      img: company
    }
  ]
};
