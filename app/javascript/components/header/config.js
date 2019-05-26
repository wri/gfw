import axios from 'axios';

import gfwClimate from 'assets/logos/gfw-climate.png';
import gfwFires from 'assets/logos/gfw-fires.png';
import gfwCommodities from 'assets/logos/gfw-commodities.png';
import forestWatcher from 'assets/logos/gfw-watcher.png';

import developer from 'assets/icons/developer.svg';
import howto from 'assets/icons/howto.svg';
import sgf from 'assets/icons/sgf.svg';
import openData from 'assets/icons/open-data.svg';
import blog from 'assets/icons/blog.svg';
import forum from 'assets/icons/forum.svg';

export default {
  navMain: [
    {
      label: 'Map',
      path: '/map',
      navLink: true
    },
    {
      label: 'Dashboard',
      path: '/dashboards',
      navLink: true
    },
    {
      label: 'Topics',
      path: '/topics',
      navLink: true,
      submenu: [
        {
          label: 'Biodiversity',
          path: '/topics/biodiversity',
          navLink: true
        },
        {
          label: 'Climate',
          path: '/topics/climate',
          navLink: true
        },
        {
          label: 'Commodities',
          path: '/topics/commodities',
          navLink: true
        },
        {
          label: 'Water',
          path: '/topics/water',
          navLink: true
        }
      ]
    },
    {
      label: 'Blog',
      extLink: 'http://blog.globalforestwatch.org'
    },
    {
      label: 'About',
      path: '/about',
      navLink: true
    }
  ],
  myGfwLinks: [
    {
      label: 'My subscriptions',
      extLink: '/my_gfw/subscriptions'
    },
    {
      label: 'My profile',
      extLink: '/my_gfw'
    },
    {
      label: 'Logout',
      extLink: '/auth/logout',
      onSelect: e => {
        e.preventDefault();
        axios
          .get(`${process.env.GFW_API}/auth/logout`, { withCredentials: true })
          .then(response => {
            if (response.status < 400) {
              localStorage.removeItem('mygfw_token');
              window.location.reload();
            } else {
              console.warn('Failed to logout');
            }
          });
      }
    }
  ],
  apps: [
    {
      label: 'GFW Climate',
      path: 'http://climate.globalforestwatch.org',
      image: gfwClimate
    },
    {
      label: 'GFW Fires',
      path: 'http://fires.globalforestwatch.org',
      image: gfwFires
    },
    {
      label: 'GFW Comodities',
      path: 'http://commodities.globalforestwatch.org',
      image: gfwCommodities
    },
    {
      label: 'Forest Watcher',
      path: 'http://forestwatcher.globalforestwatch.org',
      image: forestWatcher
    }
  ],
  moreLinks: [
    {
      label: 'Developer Tools',
      path: 'http://developers.globalforestwatch.org',
      icon: developer
    },
    {
      label: 'How to Portal',
      path: 'http://www.globalforestwatch.org/howto',
      icon: howto
    },
    {
      label: 'Grants & Fellowships',
      path: '/grants-and-fellowships',
      icon: sgf
    },
    {
      label: 'Open data portal',
      path: 'http://data.globalforestwatch.org/',
      icon: openData
    },
    {
      label: 'Blog',
      path: 'https://blog.globalforestwatch.org',
      icon: blog
    },
    {
      label: 'Discussion Forum',
      path: 'https://groups.google.com/forum/#!forum/globalforestwatch',
      icon: forum
    }
  ]
};
