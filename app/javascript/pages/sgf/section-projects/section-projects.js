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
  getGlobeClusters
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ projects }) => {
  const projectData = {
    data: projects.data && projects.data.projects,
    latLngs: projects.data.latLngs,
    images: projects.data.images,
    search: projects.search,
    categorySelected: projects.categorySelected
  };

  return {
    data: getProjectsSelected(projectData),
    globeData: getGlobeClusters(projectData),
    categories: getCategoriesList(projectData),
    categorySelected: projects.categorySelected,
    search: projects.search
  };
};

class SectionProjectsContainer extends PureComponent {
  handleCardClick = d => {
    this.props.setSectionProjectsModal({
      isOpen: true,
      data: d
    });
  };

  handleGlobeClick = d => {
    const { setSectionProjectsModal } = this.props;
    if (!d.cluster || d.cluster.length === 1) {
      setSectionProjectsModal({
        isOpen: true,
        data: d.cluster[0]
      });
    }
  };

  render() {
    return createElement(SectionProjectsComponent, {
      ...this.props,
      handleCardClick: this.handleCardClick,
      handleGlobeClick: this.handleGlobeClick
    });
  }
}

SectionProjectsContainer.propTypes = {
  setSectionProjectsModal: PropTypes.func
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsContainer);
