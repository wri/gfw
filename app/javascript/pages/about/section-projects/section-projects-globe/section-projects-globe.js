import { connect } from 'react-redux';

import { actions } from 'pages/sgf/section-projects/section-projects-modal';

import SectionProjectsGlobeComponent from './section-projects-globe-component';

export default connect(null, actions)(SectionProjectsGlobeComponent);
