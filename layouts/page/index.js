import { connect } from 'react-redux';

import { setSearchQuery } from 'pages/search/actions';

import Component from './component';
import { getPageProps } from './selectors';

export default connect(getPageProps, { setSearchQuery })(Component);
