import { connect } from 'react-redux';
import reducerRegistry from 'redux/registry';

import {
  setMapPromptsSettings,
  setShowMapPrompts,
} from 'components/prompts/map-prompts/actions';
import { selectShowMapPrompts } from 'components/prompts/map-prompts/selectors';

import MapWelcomeImage1 from 'assets/images/map-welcome-1.png';
import MapWelcomeImage2 from 'assets/images/map-welcome-2.png';
import MapWelcomeImage3 from 'assets/images/map-welcome-3.png';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapTourSteps = [
  {
    label: 'Explore recent deforestation and fire alerts',
    thumbnail: MapWelcomeImage1,
    promptKey: 'recentImageryTour',
  },
  {
    label: 'Analyze historical trends in tree cover loss and gain since 2000',
    thumbnail: MapWelcomeImage2,
    promptKey: 'analyzeAnAreaTour',
  },
  {
    label: 'Read the latest reporting on tropical forest loss',
    thumbnail: MapWelcomeImage3,
    promptKey: 'analyzeAnAreaTour',
  },
];

const mapStateToProps = (state) => {
  const { open, hideModal } = state.modalWelcome || {};

  return {
    open,
    mapTourSteps,
    showPrompts: selectShowMapPrompts(state),
    title: hideModal
      ? 'Map How-To Guide'
      : 'Welcome to the new Global Forest Watch map!',
    description: 'What yould you like to do?'
  };
};

reducerRegistry.registerModule('modalWelcome', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, {
  ...actions,
  setMapPromptsSettings,
  setShowMapPrompts,
})(Component);
