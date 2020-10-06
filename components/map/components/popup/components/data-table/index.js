import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';

import Component from './component';
import { getDataTableProps } from './selectors';

export default connect(getDataTableProps, { setMapSettings })(Component);
