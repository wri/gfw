/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Pages
import * as projects from 'pages/sgf/section-projects/section-projects';

const pagesReducers = {
  projects: handleActions(projects)
};

// Components
import * as globeComponent from 'components/globe/globe';

const componentsReducers = {
  globe: handleActions(globeComponent)
};

export default combineReducers({
  ...pagesReducers,
  ...componentsReducers,
  location: router.reducer
});
