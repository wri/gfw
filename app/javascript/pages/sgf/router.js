import { connectRoutes, NOT_FOUND } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import Projects from 'pages/sgf/section-projects/section-projects';
import About from 'pages/sgf/section-about/section-about';
import Apply from 'pages/sgf/section-apply/section-apply';

import { fetchProjects } from 'pages/sgf/section-projects/section-projects-actions';

const history = createHistory();

const PROJECTS = 'location/PROJECTS';
const ABOUT = 'location/ABOUT';
const APPLY = 'location/APPLY';

export const routes = {
  [PROJECTS]: {
    path: '/small-grants-fund',
    thunk: fetchProjects(),
    component: Projects,
    label: 'Projects',
    submenu: true
  },
  [ABOUT]: {
    path: '/small-grants-fund/about',
    component: About,
    label: 'About',
    submenu: true
  },
  [APPLY]: {
    path: '/small-grants-fund/apply',
    component: Apply,
    label: 'Apply',
    submenu: true
  },
  [NOT_FOUND]: '/'
};

export { PROJECTS, ABOUT, APPLY };
export default connectRoutes(history, routes);
