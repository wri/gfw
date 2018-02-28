import { connect } from 'react-redux';

import { actions as modalActions } from 'pages/about/section-projects/section-projects-modal';
import * as sectionActions from './section-projects-actions';

import reducers, { initialState } from './section-projects-reducers';
import SectionProjectsComponent from './section-projects-component';

import {
  getCategoriesList,
  getProjectsSelected
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ projects }) => {
  const projectData = {
    data: projects.data,
    categorySelected: projects.categorySelected
  };

  return {
    projects: getProjectsSelected(projectData),
    categories: getCategoriesList(projectData),
    categorySelected: projects.categorySelected
  };
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsComponent);
