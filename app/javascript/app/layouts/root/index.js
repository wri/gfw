import { connect } from 'react-redux';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';

import Component from './component';

import { getPageProps } from './selectors';

export default connect(getPageProps, { setModalContactUsOpen })(Component);
