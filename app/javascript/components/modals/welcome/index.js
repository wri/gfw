import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setMapPromptsSettings } from 'components/maps/main-map/components/map-prompts/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapTourSteps = [
  {
    label: 'View recent satellite imagery, searchable by date and cloud cover.',
    promptKey: 'recentImagery'
  }
];

const mapStateToProps = ({ modalWelcome }) => {
  const { open, hideModal } = modalWelcome || {};

  return {
    open,
    mapTourSteps,
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
export default connect(mapStateToProps, { ...actions, setMapPromptsSettings })(
  Component
);
