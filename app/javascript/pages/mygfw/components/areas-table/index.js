import { connect } from 'react-redux';

import { setSaveAOISettings } from 'components/modals/save-aoi/actions';
import { viewArea } from 'providers/areas-provider/actions';
import { setShareModal } from 'components/modals/share/share-actions';

import Component from './component';

export default connect(null, {
  setSaveAOISettings,
  viewArea,
  setShareModal
})(Component);
