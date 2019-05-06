import { connect } from 'react-redux';

import * as mapActions from 'components/map/actions';
import { getRecentImageryProps } from 'components/recent-imagery/selectors';
import {
  setRecentImagerySettings,
  setRecentImageryLoading
} from 'components/recent-imagery/actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';

import Component from './component';

const actions = {
  ...mapActions,
  setRecentImagerySettings,
  setRecentImageryLoading,
  setModalMetaSettings
};

export default connect(getRecentImageryProps, actions)(Component);
