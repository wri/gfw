/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as recentImageryComponent from 'pages/map/recent-imagery';

// Component Reducers
const componentsReducers = {
  recentImagery: handleActions(recentImageryComponent)
};

export default combineReducers({
  ...componentsReducers,
  location: router.reducer
});
