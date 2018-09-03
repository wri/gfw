import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { scroller } from 'react-scroll';

import { actions as modalActions } from 'pages/sgf/section-projects/section-projects-modal';
import * as sectionActions from './section-projects-actions';

import reducers, { initialState } from './section-projects-reducers';
import SectionProjectsComponent from './section-projects-component';
import {
  getCategoriesList,
  getProjectsList,
  getGlobeClusters
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ projects }) => {
  const filters = projects.customFilter;
  const projectData = {
    data: projects.data && projects.data.projects,
    latLngs: projects.data.latLngs,
    images: projects.data.images,
    search: projects.search,
    categorySelected: projects.categorySelected,
    customFilter: filters
  };

  return {
    data: getProjectsList(projectData),
    globeData: getGlobeClusters(projectData),
    categories: getCategoriesList(projectData),
    categorySelected:
      filters && filters.length ? '' : projects.categorySelected,
    search: projects.search,
    loading:
      !projects ||
      projects.loading ||
      (projects.data.projects && !projects.data.projects.length) ||
      !projects.data.images,
    customFilter: projects.customFilter
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
    const { setSectionProjectsModal, setCustomFilter } = this.props;
    if (!d.cluster || d.cluster.length === 1) {
      setSectionProjectsModal({
        isOpen: true,
        data: d.cluster[0]
      });
    } else {
      const projectIds = d.cluster.map(p => p.id);
      setCustomFilter(projectIds);
      scroller.scrollTo('project-cards', {
        duration: 800,
        smooth: true,
        offset: -50
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
  setSectionProjectsModal: PropTypes.func,
  setCustomFilter: PropTypes.func
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(SectionProjectsContainer);
