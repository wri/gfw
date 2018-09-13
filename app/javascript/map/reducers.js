/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleModule } from 'redux-tools';

// Routes
import router from './router';

// Pages
import { reduxModule as map } from './map';
import { reduxModule as RecentImagery } from './map/recent-imagery';

export default combineReducers({
  recentImagery: handleModule(RecentImagery),
  root: handleModule(map),
  location: router.reducer
});
