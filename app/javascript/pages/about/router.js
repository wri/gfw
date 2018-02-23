import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import Projects from 'pages/about/section-projects';
import Impacts from 'pages/about/section-impacts';

import { fetchImpactProjects } from 'pages/about/section-impacts/section-impacts-actions';

const history = createHistory();

export const ABOUT = 'location/ABOUT';

export const routes = {
  [ABOUT]: {
    path: '/about',
    thunk: fetchImpactProjects(),
    sections: [
      {
        label: 'GFW in Action',
        anchor: 'gfw-in-action',
        component: ''
      },
      {
        label: 'Impacts',
        anchor: 'impacts',
        component: Impacts
      },
      {
        label: 'History',
        anchor: 'history',
        component: ''
      },
      {
        label: 'Contact Us',
        anchor: 'contact-us',
        component: ''
      },
      {
        label: 'Partnership',
        anchor: 'partnership',
        component: ''
      }
    ]
  }
};

export default connectRoutes(history, routes);
