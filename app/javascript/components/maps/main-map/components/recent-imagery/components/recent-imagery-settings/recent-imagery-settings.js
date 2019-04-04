import { connect } from 'react-redux';

import * as mapActions from 'components/maps/map/actions';
import { getRecentImageryProps } from 'components/maps/main-map/components/recent-imagery/recent-imagery-selectors';
import {
  setRecentImagerySettings,
  setRecentImageryLoading
} from 'components/maps/main-map/components/recent-imagery/recent-imagery-actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';

import Component from './recent-imagery-settings-component';

const actions = {
  ...mapActions,
  setRecentImagerySettings,
  setRecentImageryLoading,
  setModalMetaSettings
};

export default connect(getRecentImageryProps, actions)(Component);
