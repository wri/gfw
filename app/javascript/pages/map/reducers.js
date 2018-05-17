/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Pages
import * as map from 'pages/map/root';

const pagesReducers = {
  root: handleActions(map)
};

// Components
import * as recentImageryComponent from 'pages/map/recent-imagery';

// Component Reducers
const componentsReducers = {
  recentImagery: handleActions(recentImageryComponent)
};

export default combineReducers({
  ...pagesReducers,
  ...componentsReducers,
  location: router.reducer
});
