import { connect } from 'react-redux';

import reducerRegistry from 'redux/registry';

import { getProjectsWithImages } from 'components/pagessgf/section-projects/selectors';

import reducers, { initialState } from './reducers';
import * as actions from './actions';
import SectionProjectsModalComponent from './component';

const mapStateToProps = ({ sgfModal }, { projects, images }) => {
  const slug = sgfModal?.open;
  const allProjects = getProjectsWithImages({ data: projects, images });

  return {
    slug,
    data: allProjects && allProjects.find((p) => p.id === parseInt(slug, 10)),
  };
};

reducerRegistry.registerModule('sgfModal', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(SectionProjectsModalComponent);
