import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { actions as modalActions } from 'pages/about/section-projects/section-projects-modal';
import * as sectionActions from './section-projects-actions';

import reducers, { initialState } from './section-projects-reducers';
import SectionProjectsComponent from './section-projects-component';

import {
  getCategoriesList,
  getProjectsSelected
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ aboutProjects }) => {
  const projectData = {
    data: aboutProjects.data,
    categorySelected: aboutProjects.categorySelected
  };

  return {
    projects: getProjectsSelected(projectData),
    categories: getCategoriesList(projectData),
    categorySelected: aboutProjects.categorySelected
  };
};
class SectionProjectsContainer extends PureComponent {
  componentDidMount() {
    const { fetchProjects } = this.props;
    fetchProjects();
  }

  handleGlobeClick = d => {
    const { setSectionProjectsModal } = this.props;
    setSectionProjectsModal({
      isOpen: true,
      data: d
    });
  };

  render() {
    return createElement(SectionProjectsComponent, {
      ...this.props,
      handleGlobeClick: this.handleGlobeClick
    });
  }
}

SectionProjectsContainer.propTypes = {
  setSectionProjectsModal: PropTypes.func,
  fetchProjects: PropTypes.func
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsContainer);
