import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';

import { getBasemapProps } from './selectors';

import Component from './component';

export default connect(getBasemapProps, { setMapSettings })(Component);
