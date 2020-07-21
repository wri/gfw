import { connect } from 'react-redux';

import Component from './component';

import { getPageProps } from './selectors';

export default connect(getPageProps)(Component);
