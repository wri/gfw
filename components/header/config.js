export default {
  navMain: [
    { label: 'Map', href: '/map/', isVisibleOnMobile: true },
    {
      label: 'Dashboard',
      href: '/dashboards/global/',
      isVisibleOnMobile: true,
    },
    {
      label: 'Help',
      href: '/help/',
      isVisibleOnMobile: false,
      submenu: [
        {
          label: 'Tutorials',
          href: '/help/',
        },
        /* // TODO: enable these 2 links when we have the real urls
        {
          label: 'Events',
          href: '/events/',
        },
        {
          label: 'FAQ',
          href: '/faq/',
        },
        */
        {
          label: 'Community Forum',
          extLink: 'https://groups.google.com/forum/#!forum/globalforestwatch/',
        },
        {
          label: 'Grants & Opportunities',
          href: '/grants-and-fellowships/projects/',
        },
        {
          label: 'Contact Us',
          onClick: () => [],
          isContactModal: true,
        },
      ],
    },
    {
      label: 'About',
      href: '/about/',
      isVisibleOnMobile: false,
      submenu: [
        {
          label: 'About GFW',
          href: '/about/',
        },
        {
          label: 'Why Forests',
          href: '/topics/biodiversity/',
        },
      ],
    },
    {
      label: 'Blog',
      href: '/blog/',
      isVisibleOnMobile: true,
    },
  ],
};
