import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';

import Component from './component';
import { getBoundarySentenceProps } from './selectors';

export default connect(getBoundarySentenceProps, { setMapSettings })(Component);
