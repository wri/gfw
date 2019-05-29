import { connect } from 'react-redux';

import * as actions from 'components/modals/video/video-actions';
import { routes } from 'router';
import PageComponent from './component';

import config from './config';

const mapStateToProps = () => ({
  sections: Object.values(routes)[0].sections,
  ...config
});

export default connect(mapStateToProps, actions)(PageComponent);
