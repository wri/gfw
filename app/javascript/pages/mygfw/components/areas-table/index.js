import { connect } from 'react-redux';

import { setSaveAOISettings } from 'components/modals/save-aoi/actions';
import { viewArea } from 'providers/areas-provider/actions';
import { setShareModal } from 'components/modals/share/share-actions';

import { getAreasTableProps } from './selectors';
import Component from './component';

export default connect(getAreasTableProps, {
  setSaveAOISettings,
  viewArea,
  setShareModal
})(Component);
