import { connect } from 'react-redux';

import { setMapTourOpen } from 'components/maps/main-map/components/map-tour/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ modalWelcome }) => ({
  open: modalWelcome.open
});

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, { ...actions, setMapTourOpen })(
  Component
);
