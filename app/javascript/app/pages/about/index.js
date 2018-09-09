import { connect } from 'react-redux';

import actions from 'components/modals/video/video-actions';
import { routes } from 'router';
import PageComponent from './component';

const mapStateToProps = () => ({
  sections: Object.values(routes)[0].sections
});

export default connect(mapStateToProps, actions)(PageComponent);
