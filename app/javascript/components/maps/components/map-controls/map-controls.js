import { connect } from 'react-redux';

import { setMapTourOpen } from 'components/maps/components/map-tour/actions';
import * as shareActions from 'components/modals/share/share-actions';
import * as mapActions from 'components/maps/map/actions';
import * as recentImageryActions from 'components/maps/components/recent-imagery/recent-imagery-actions';

import { setMenuSettings } from 'components/maps/components/menu/menu-actions';
import Component from './map-controls-component';
import { getMapControlsProps } from './map-controls-selectors';

const actions = {
  ...mapActions,
  ...shareActions,
  setMenuSettings,
  setMapTourOpen,
  ...recentImageryActions
};

export default connect(getMapControlsProps, actions)(Component);
