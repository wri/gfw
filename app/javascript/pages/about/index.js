import { connect } from 'react-redux';

import * as actions from 'components/modals/video/video-actions';
import PageComponent from './component';

export default connect(null, actions)(PageComponent);
