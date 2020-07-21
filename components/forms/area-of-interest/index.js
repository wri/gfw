import { connect } from 'react-redux';

import { setModalSources } from 'components/modals/sources/actions';
import Component from './component';
import * as actions from './actions';
import { getAreaOfInterestProps } from './selectors';

export default connect(getAreaOfInterestProps, { ...actions, setModalSources })(
  Component
);
