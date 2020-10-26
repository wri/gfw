import { connect } from 'react-redux';

import { registerModule } from 'redux/store';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

const MapContainer = (props) => {
  registerModule({
    key: 'map',
    reducers,
    initialState,
  });

  return <MapComponent {...props} />;
};

export default connect(getMapProps, actions)(MapContainer);
