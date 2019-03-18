import { connect } from 'react-redux';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import Component from './component';

export default connect(null, { setModalContactUsOpen })(Component);
