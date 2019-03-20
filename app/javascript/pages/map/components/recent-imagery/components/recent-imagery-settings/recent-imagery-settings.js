import { connect } from 'react-redux';

import * as mapActions from 'components/map/actions';
import { getRecentImageryProps } from 'pages/map/components/recent-imagery/recent-imagery-selectors';
import { setRecentImagerySettings } from 'pages/map/components/recent-imagery/recent-imagery-actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';

import Component from './recent-imagery-settings-component';

const actions = {
  ...mapActions,
  setRecentImagerySettings,
  setModalMetaSettings
};

export default connect(getRecentImageryProps, actions)(Component);
