export default {
  navMain: [
    { label: 'Map', href: '/map/' },
    { label: 'Dashboard', href: '/dashboards/global/' },
    {
      label: 'Topics',
      href: '/topics/',
      submenu: [
        {
          label: 'Biodiversity',
          href: '/topics/biodiversity/',
        },
        { label: 'Climate', href: '/topics/climate/' },
        {
          label: 'Commodities',
          href: '/topics/commodities/',
        },
        { label: 'Water', href: '/topics/water/' },
        { label: 'Fires', href: '/topics/fires/' },
      ],
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    { label: 'About', href: '/about/' },
    { label: 'Help', href: '/help/' },
  ],
};
