/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Sections
import * as impacts from 'pages/about/section-impacts';

const sectionsReducers = {
  impacts: handleActions(impacts)
};

// Components
// import * as projectsModal from 'pages/about/section-projects/section-projects-modal';

// const componentsReducers = {
//   projectsModal: handleActions(projectsModal)
// };

export default combineReducers({
  ...sectionsReducers,
  // ...componentsReducers,
  location: router.reducer
});
