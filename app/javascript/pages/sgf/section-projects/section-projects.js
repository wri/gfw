import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { scroller } from 'react-scroll';
import reducerRegistry from 'app/registry';

import * as modalActions from 'pages/sgf/section-projects/section-projects-modal/section-projects-modal-actions';
import * as sectionActions from './section-projects-actions';

import reducers, { initialState } from './section-projects-reducers';
import SectionProjectsComponent from './section-projects-component';
import {
  getCategoriesList,
  getProjectsList,
  getGlobeClusters
} from './section-projects-selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ sgfProjects }) => {
  const filters = sgfProjects && sgfProjects.customFilter;
  const projectData = {
    data: sgfProjects && sgfProjects.data && sgfProjects.data.projects,
    latLngs: sgfProjects && sgfProjects.data.latLngs,
    images: sgfProjects && sgfProjects.data.images,
    search: sgfProjects && sgfProjects.search,
    categorySelected: sgfProjects && sgfProjects.categorySelected,
    customFilter: filters
  };

  return {
    data: getProjectsList(projectData),
    globeData: getGlobeClusters(projectData),
    categories: getCategoriesList(projectData),
    categorySelected:
      filters && filters.length ? '' : sgfProjects.categorySelected,
    search: sgfProjects && sgfProjects.search,
    loading:
      !sgfProjects ||
      sgfProjects.loading ||
      (sgfProjects.data.projects && !sgfProjects.data.projects.length) ||
      !sgfProjects.data.images,
    customFilter: sgfProjects && sgfProjects.customFilter
  };
};

class SectionProjectsContainer extends PureComponent {
  componentDidMount() {
    const { fetchProjects, fetchProjectsImages } = this.props;
    fetchProjects();
    fetchProjectsImages();
  }

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
  setCustomFilter: PropTypes.func,
  fetchProjects: PropTypes.func,
  fetchProjectsImages: PropTypes.func
};

reducerRegistry.registerModule('sgfProjects', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(SectionProjectsContainer);
