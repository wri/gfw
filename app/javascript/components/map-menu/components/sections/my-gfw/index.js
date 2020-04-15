import { connect } from 'react-redux';

import { viewArea } from 'providers/areas-provider/actions';
import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';

import Component from './component';
import mapStateToProps from './selectors';

export default connect(mapStateToProps, {
  viewArea,
  onEditClick: setAreaOfInterestModalSettings,
  setMapPromptsSettings
})(Component);
