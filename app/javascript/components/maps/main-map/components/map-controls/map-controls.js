import { connect } from 'react-redux';

import { setShareModal } from 'components/modals/share/share-actions';
import { setMenuSettings } from 'components/maps/components/menu/menu-actions';
import { setMapSettings } from 'components/maps/map/actions';
import { setMapTourOpen } from 'components/maps/main-map/components/map-tour/actions';
import { setMapMainSettings } from 'components/maps/main-map/actions';
import { setRecentImagerySettings } from 'components/maps/main-map/components/recent-imagery/recent-imagery-actions';

import Component from './map-controls-component';
import { getMapControlsProps } from './map-controls-selectors';

const actions = {
  setShareModal,
  setMenuSettings,
  setMapTourOpen,
  setMapSettings,
  setMapMainSettings,
  setRecentImagerySettings
};

export default connect(getMapControlsProps, actions)(Component);
