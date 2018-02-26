/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Sections
import * as impacts from 'pages/about/section-impacts';
import * as projects from 'pages/about/section-projects';

const sectionsReducers = {
  impacts: handleActions(impacts),
  projects: handleActions(projects)
};

// Components
import * as projectsModal from 'pages/about/section-projects/section-projects-modal';
import * as modalVideo from 'components/modal-video';

const componentsReducers = {
  projectsModal: handleActions(projectsModal),
  modalVideo: handleActions(modalVideo)
};

export default combineReducers({
  ...sectionsReducers,
  ...componentsReducers,
  location: router.reducer
});
