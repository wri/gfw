import { connect } from 'react-redux';

import { getActiveLayers } from './selectors';
import Component from './component';

const mapStateToProps = ({ location, datasets }) => ({
  layerGroups: getActiveLayers({ datasets: datasets.data }),
  activeTab: location.payload.zoom,
  legendLoading: datasets.loading
});

export default connect(mapStateToProps, null)(Component);
