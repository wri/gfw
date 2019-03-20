import { connect } from 'react-redux';

import { setShareModal } from 'components/modals/share/share-actions';
import { setMenuSettings } from 'pages/map/components/menu/menu-actions';
import { setMapSettings } from 'components/map/actions';
import { setMapTourOpen } from 'pages/map/components/map-tour/actions';
import { setMainMapSettings } from 'pages/map/components/map/actions';

import Component from './map-controls-component';
import { getMapControlsProps } from './map-controls-selectors';

export default connect(getMapControlsProps, {
  setShareModal,
  setMenuSettings,
  setMapTourOpen,
  setMapSettings,
  setMainMapSettings
})(Component);
