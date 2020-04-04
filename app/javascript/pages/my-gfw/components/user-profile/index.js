import { connect } from 'react-redux';

import { setProfileModalOpen } from 'components/modals/profile/actions';

import getUserProfleProps from './selectors';
import Component from './component';

export default connect(getUserProfleProps, { setProfileModalOpen })(Component);
