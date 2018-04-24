import { connect } from 'react-redux';

import actions from 'components/modals/video/modal-video-actions';
import { routes } from 'pages/about/router';
import PageComponent from './page-component';

const mapStateToProps = () => ({
  sections: Object.values(routes)[0].sections
});

export default connect(mapStateToProps, actions)(PageComponent);
