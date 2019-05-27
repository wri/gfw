import { connect } from 'react-redux';

import { setMapPromptsSettings } from 'components/map-prompts/actions';
import * as actions from 'components/map-menu/actions';
import { mapStateToProps } from './selectors';

import ExploreComponent from './component';

export default connect(mapStateToProps, { ...actions, setMapPromptsSettings })(
  ExploreComponent
);
