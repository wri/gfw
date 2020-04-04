import { connect } from 'react-redux';
import withRouter from 'utils/withRouter';

import { getProjectsWithImages } from 'layouts/grants-and-fellowships/section-projects/selectors';

import SectionProjectsModalComponent from './component';

const mapStateToProps = ({ sgfProjects }, { router }) => {
  const { query } = router;
  const slug = query?.sgfModal;
  const { projects, images } = (sgfProjects && sgfProjects.data) || {};
  const allProjects = getProjectsWithImages({ data: projects, images });

  return {
    slug,
    data: allProjects && allProjects.find((p) => p.id === parseInt(slug, 10)),
  };
};

export default withRouter(
  connect(mapStateToProps)(SectionProjectsModalComponent)
);
