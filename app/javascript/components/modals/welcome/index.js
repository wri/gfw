import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import {
  setMapPromptsSettings,
  setShowMapPrompts
} from 'components/map-prompts/actions';
import { selectShowMapPrompts } from 'components/map-prompts/selectors';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapTourSteps = [
  {
    label: 'View recent satellite imagery, searchable by date and cloud cover.',
    promptKey: 'recentImageryTour'
  },
  {
    label:
      'Analyze forest change within your area of interest by clicking a shape on the map or drawing or uploading a shape.',
    promptKey: 'analyzeAnAreaTour'
  }
];

const mapStateToProps = state => {
  const { open, hideModal } = state.modalWelcome || {};

  return {
    open,
    mapTourSteps,
    showPrompts: selectShowMapPrompts(state),
    title: hideModal
      ? 'Map How-To Guide'
      : 'Welcome to the new Global Forest Watch map!',
    description: hideModal
      ? ''
      : "We've made exciting changes to the map to make it faster, more powerful, and easier to use."
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
