import { connect } from 'react-redux';

import { setProfileSettings } from 'components/modals/profile/actions';

import { getUserProfleProps } from './selectors';
import Component from './component';

export default connect(getUserProfleProps, { setProfileSettings })(Component);
