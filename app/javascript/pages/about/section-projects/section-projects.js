import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions as modalActions } from 'pages/sgf/section-projects/section-projects-modal';
import * as sectionActions from './section-projects-actions';

import reducers, { initialState } from './section-projects-reducers';
import SectionProjectsComponent from './section-projects-component';
import {
  getCategoriesList,
  getProjectsSelected,
  getCategorySelected
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ projects }) => {
  const projectData = {
    data: projects.data,
    categorySelected: projects.categorySelected
  };

  return {
    data: getProjectsSelected(projectData),
    categories: getCategoriesList(projects),
    categorySelected: getCategorySelected(projects)
  };
};

class SectionProjectsContainer extends PureComponent {
  handleCardClick = d => {
    this.props.setSectionProjectsModal({
      isOpen: true,
      data: d
    });
  };

  render() {
    return createElement(SectionProjectsComponent, {
      ...this.props,
      handleCardClick: this.handleCardClick
    });
  }
}

SectionProjectsContainer.propTypes = {
  setSectionProjectsModal: PropTypes.func
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsContainer);
