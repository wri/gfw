import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as modalActions from 'pages/about/section-projects/section-projects-modal/actions';

import * as sectionActions from './actions';
import reducers, { initialState } from './reducers';
import SectionProjectsComponent from './component';

import { getCategoriesList, getProjectsSelected } from './selectors';

const actions = { ...sectionActions, ...modalActions };

const mapStateToProps = ({ aboutProjects }) => {
  const projectData = {
    data: aboutProjects && aboutProjects.data,
    categorySelected: aboutProjects && aboutProjects.categorySelected,
  };

  return {
    projects: getProjectsSelected(projectData),
    categories: getCategoriesList(projectData),
    categorySelected: aboutProjects && aboutProjects.categorySelected,
  };
};
class SectionProjectsContainer extends PureComponent {
  componentDidMount() {
    const { fetchProjects } = this.props;
    fetchProjects();
  }

  handleGlobeClick = (d) => {
    const { setSectionProjectsModal } = this.props;
    setSectionProjectsModal({
      isOpen: true,
      data: d,
    });
  };

  render() {
    return createElement(SectionProjectsComponent, {
      ...this.props,
      handleGlobeClick: this.handleGlobeClick,
    });
  }
}

SectionProjectsContainer.propTypes = {
  setSectionProjectsModal: PropTypes.func,
  fetchProjects: PropTypes.func,
};

reducerRegistry.registerModule('aboutProjects', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(SectionProjectsContainer);
