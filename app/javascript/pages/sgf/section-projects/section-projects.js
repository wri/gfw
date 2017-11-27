import { connect } from 'react-redux';

import { actions as modalActions } from 'pages/sgf/section-projects/section-projects-modal';
import * as sectionActions from './section-projects-actions';

import reducers, { initialState } from './section-projects-reducers';
import Component from './section-projects-component';
import {
  getCategoriesList,
  getProjectsSelected,
  getCategorySelected
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ projects }) => {
  const projectData = {
    data: projects.data,
    search: projects.search
  };
  return {
    data: getProjectsSelected(projectData),
    categories: getCategoriesList(projects),
    categorySelected: getCategorySelected(projects),
    search: projects.search
  };
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
