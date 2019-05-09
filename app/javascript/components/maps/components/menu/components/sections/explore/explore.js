import { connect } from 'react-redux';

import { setMapPromptsSettings } from 'components/maps/main-map/components/map-prompts/actions';
import * as actions from 'components/maps/components/menu/menu-actions';
import { mapStateToProps } from './explore-selectors';

import ExploreComponent from './explore-component';

export default connect(mapStateToProps, { ...actions, setMapPromptsSettings })(
  ExploreComponent
);
