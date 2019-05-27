import { connect } from 'react-redux';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import PageComponent from './component';

export default connect(null, { setModalContactUsOpen })(PageComponent);
