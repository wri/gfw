import { connect } from 'react-redux';

import * as actions from 'components/modals/video/actions';
import PageComponent from './component';

export default connect(null, actions)(PageComponent);
