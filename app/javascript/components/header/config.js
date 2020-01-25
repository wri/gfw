import axios from 'axios';

import gfwClimate from 'assets/logos/gfw-climate.png';
import gfwFires from 'assets/logos/gfw-fires.png';
import gfwPro from 'assets/logos/gfw-pro.png';
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
      path: '/map'
    },
    {
      label: 'Dashboard',
      path: '/dashboards'
    },
    {
      label: 'Topics',
      path: '/topics',
      submenu: [
        {
          label: 'Biodiversity',
          path: '/topics/biodiversity'
        },
        {
          label: 'Climate',
          path: '/topics/climate'
        },
        {
          label: 'Commodities',
          path: '/topics/commodities'
        },
        {
          label: 'Water',
          path: '/topics/water'
        }
      ]
    },
    {
      label: 'Blog',
      extLink: 'https://blog.globalforestwatch.org'
    },
    {
      label: 'About',
      path: '/about'
    }
  ],
  myGfwLinks: [
    {
      label: 'My subscriptions',
      extLink: '/my_gfw/subscriptions'
    },
    {
      label: 'My profile',
      path: '/my_gfw'
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
      extLink: 'https://climate.globalforestwatch.org',
      image: gfwClimate
    },
    {
      label: 'GFW Fires',
      extLink: 'http://fires.globalforestwatch.org',
      image: gfwFires
    },
    {
      label: 'GFW Pro',
      extLink: 'https://pro.globalforestwatch.org',
      image: gfwPro
    },
    {
      label: 'Forest Watcher',
      extLink: 'http://forestwatcher.globalforestwatch.org',
      image: forestWatcher
    }
  ],
  moreLinks: [
    {
      label: 'Developer Tools',
      extLink: 'http://developers.globalforestwatch.org',
      icon: developer
    },
    {
      label: 'How to Portal',
      extLink: 'https://www.globalforestwatch.org/howto',
      icon: howto
    },
    {
      label: 'Grants & Fellowships',
      path: '/grants-and-fellowships',
      icon: sgf
    },
    {
      label: 'Open data portal',
      extLink: 'https://data.globalforestwatch.org/',
      icon: openData
    },
    {
      label: 'Blog',
      extLink: 'https://blog.globalforestwatch.org',
      icon: blog
    },
    {
      label: 'Discussion Forum',
      extLink: 'https://groups.google.com/forum/#!forum/globalforestwatch',
      icon: forum
    }
  ]
};
