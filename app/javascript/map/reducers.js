/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Routes
import router from './router';

// Pages
import { reduxModule as map } from './map';

const pagesReducers = {
  root: handleModule(map)
};

// Components
import { reduxModule as RecentImagery } from './map/recent-imagery';
// Component Reducers
const componentsReducers = {
  recentImagery: handleModule(RecentImagery)
};

export default combineReducers({
  ...pagesReducers,
  ...componentsReducers,
  location: router.reducer
});
