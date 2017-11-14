import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import Projects from 'pages/sgf/section-projects/section-projects';
import About from 'pages/sgf/section-about/section-about';
import Apply from 'pages/sgf/section-apply/section-apply';

import { fetchProjects } from 'pages/sgf/section-projects/section-projects-actions';

const history = createHistory();

export const PROJECTS = 'location/PROJECTS';
export const ABOUT = 'location/ABOUT';
export const APPLY = 'location/APPLY';

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
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: PROJECTS }))
  }
};

export default connectRoutes(history, routes);
