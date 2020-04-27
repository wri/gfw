export default {
  '/': {
    title: 'Forest Monitoring Designed for Action',
    description:
      'Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests.',
    keywords:
      'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss',
    priority: '1.0',
  },
  '/map': {
    title: 'Interactive Map',
    description:
      'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.',
    keywords:
      'GFW, map, forests, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation',
    fullScreen: true,
    priority: '0.8',
  },
  '/map/[...location]': {
    title: '{locationName} | Interactive Map',
    description:
      'Explore the status of forests in {locationName} by layering data to create custom maps of forest change, cover and use.',
    keywords:
      'GFW, map, forests, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation',
    fullScreen: true,
  },
  '/dashboards/global': {
    title: 'Global | Dashboards',
    description:
      'Analyze and investigate global data trends in forest change, cover and use with just a few clicks.',
    keywords:
      'GFW, forests, dashboard, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, investigate, tree, cover, loss, country, deforestation, land use, forest change.',
    priority: '0.8',
  },
  '/dashboards/[...location]': {
    title: '{locationName} | Dashboards',
    description:
      'Analyze and investigate data trends in forest change, cover and use in {locationName} with just a few clicks.',
    keywords:
      'GFW, forests, dashboard, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, investigate, tree, cover, loss, country, deforestation, land use, forest change.',
  },
  '/about': {
    title: 'About GFW',
    description:
      'Global Forest Watch is an online platform that provides data and tools for monitoring forests.',
    keywords:
      'GFW, about, global forest watch, about gfw, history, staff, world resources institute, wri, about gfw pro, about gfw fires, about forest watcher, forests',
    priority: '0.8',
  },
  '/grants-and-fellowships': {
    title: 'Projects | Grants & Fellowships',
    description:
      'The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work.',
    keywords:
      'forests, forest data, data, technology, forest monitoring, forest policy, advocacy, education, fellow, fellowship, grants, civil society, land rights, conservation, field work, local, deforestation, community, research',
    priority: '0.8',
  },
  '/grants-and-fellowships/[section]': {
    title: '{section} | Grants & Fellowships',
    description:
      'The Small Grants Fund & Tech Fellowship support civil society organizations and individuals around the world to use GFW in their advocacy, research and field work.',
    keywords:
      'forests, forest data, data, technology, forest monitoring, forest policy, advocacy, education, fellow, fellowship, grants, civil society, land rights, conservation, field work, local, deforestation, community, research',
    priority: '0.8',
    allowedParams: {
      section: ['projects', 'about', 'apply'],
    },
  },
  '/topics': {
    title: 'Biodiversity | Topics',
    description:
      'Explore the relationship between forests and several key themes critical to sustainability and the health of our future ecosystems.',
    keywords:
      'biodiversity, commodities, water, climate, forests, sustainability, ecosystems, health, deforestation, conservation, forest loss',
    hideFooter: true,
    priority: '0.8',
  },
  '/topics/[topic]': {
    title: '{topic} | Topics',
    description:
      'Explore the relationship between forests and several key themes critical to sustainability and the health of our future ecosystems.',
    keywords:
      'biodiversity, commodities, water, climate, forests, sustainability, ecosystems, health, deforestation, conservation, forest loss',
    hideFooter: true,
    priority: '0.6',
    allowedParams: {
      topic: ['biodiversity', 'climate', 'commodities', 'water'],
    },
  },
  '/my-gfw': {
    title: 'My GFW',
    description:
      'Create an account or log into My GFW. Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use.',
    keywords:
      'GFW, forests, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation, subscribe',
    priority: '0.6',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description:
      'This Privacy Policy tells you how WRI handles information collected about you through our websites and applications.',
    keywords:
      'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher',
    priority: '0.6',
  },
  '/terms': {
    title: 'Terms of Service',
    description:
      'Welcome to the WRI family of environmental data platforms. By using the Services, you agree to be bound by these Terms of Service and any future updates.',
    keywords:
      'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher',
    priority: '0.6',
  },
  '/subscribe': {
    title: "Stay Updated on the World's Forests",
    description:
      'Subscribe to monthly GFW newsletters and updates based on your interests.',
    keywords: 'GFW, newsletter',
    priority: '0.6',
  },
  '/search': {
    title: 'Search',
    description:
      'Search forest information, including forest data, news, updates and more.',
    keywords:
      'GFW, forests, forest data, data, forest news, forest alerts, conservation, forest updates, forest watch, deforestation, deforesting, tree cover loss, forest loss',
    priority: '0.6',
  },
  '/thank-you': {
    title: 'Thank you',
    priority: '0.4',
  },
  '/browser-support': {
    title: 'Browser Not Supported',
    description:
      'Oops, your browser isn’t supported. Please upgrade to a supported browser and try loading the website again.',
    hideHeader: true,
    hideFooter: true,
    hideCookies: true,
  },
  '/404': {
    title: 'Page Not Found',
    description:
      'You may have mistyped the address or the page may have moved.',
    hideCookies: true,
  },
};
