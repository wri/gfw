import gfwClimate from 'assets/logos/gfw-climate.png';
import gfwFires from 'assets/logos/gfw-fires.png';
import gfwCommodities from 'assets/logos/gfw-commodities.png';
import gfwWater from 'assets/logos/gfw-water.png';
import forestWatcher from 'assets/logos/gfw-watcher.png';

import moreIcon from 'assets/icons/more.svg';

export default {
  navMain: [
    {
      label: 'Map',
      path: '/map'
    },
    {
      label: 'Dashboards',
      path: '/dashboards/global'
    },
    {
      label: 'Blog',
      path: 'http://blog.globalforestwatch.org',
      target: '_blank',
      rel: 'noopener nofollower'
    },
    {
      label: 'About',
      path: '/map'
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
      label: 'GFW Water',
      path: 'http://water.globalforestwatch.org',
      image: gfwWater
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
      icon: moreIcon
    },
    {
      label: 'How to Portal',
      path: 'http://www.globalforestwatch.org/howto',
      icon: moreIcon
    }
  ]
};
