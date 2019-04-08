import { connect } from 'react-redux';

import { setShareModal } from 'components/modals/share/share-actions';
import { setMenuSettings } from 'components/maps/components/menu/menu-actions';
import { setMapSettings } from 'components/maps/map/actions';
import { setMapPromptsSettings } from 'components/maps/main-map/components/map-prompts/actions';
import { setMainMapSettings } from 'components/maps/main-map/actions';

import Component from './map-controls-component';
import { getMapControlsProps } from './map-controls-selectors';

export default connect(getMapControlsProps, {
  setShareModal,
  setMenuSettings,
  setMapPromptsSettings,
  setMapSettings,
  setMainMapSettings
})(Component);
