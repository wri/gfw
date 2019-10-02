import { connect } from 'react-redux';

import { viewArea } from 'providers/areas-provider/actions';
import { setSaveAOISettings } from 'components/modals/save-aoi/actions';
import { setMapPromptsSettings } from 'components/map-prompts/actions';

import Component from './component';
import { mapStateToProps } from './selectors';

export default connect(mapStateToProps, {
  viewArea,
  onEditClick: setSaveAOISettings,
  setMapPromptsSettings
})(Component);
