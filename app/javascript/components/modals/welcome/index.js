import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import {
  setMapPromptsSettings,
  setShowMapPrompts
} from 'components/maps/main-map/components/map-prompts/actions';
import { getShowMapPrompts } from 'components/maps/main-map/components/map-prompts/selectors';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapTourSteps = [
  {
    label: 'View recent satellite imagery, searchable by date and cloud cover.',
    promptKey: 'recentImagery'
  }
];

const mapStateToProps = state => {
  const { open, hideModal } = state.modalWelcome || {};

  return {
    open,
    mapTourSteps,
    showPrompts: getShowMapPrompts(state),
    title: hideModal
      ? 'Map how-to guide'
      : 'Welcome to the new Global Forest Watch map!',
    description: hideModal
      ? ''
      : 'We&#39;ve made exciting changes to the map to make it faster, more powerful, and easier to use.'
  };
};

reducerRegistry.registerModule('modalWelcome', {
  actions,
  reducers,
  initialState
});
export default connect(mapStateToProps, {
  ...actions,
  setMapPromptsSettings,
  setShowMapPrompts
})(Component);
