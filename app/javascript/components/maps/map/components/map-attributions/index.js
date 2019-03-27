import { connect } from 'react-redux';
import { setModalAttributions } from 'components/modals/attributions/actions';

import Component from './component';

export default connect(null, { setModalAttributions })(Component);
