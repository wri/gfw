import { connect } from 'react-redux';

import { getLayerGroups } from 'components/map/map-selectors';
import Component from './component';

const mapStateToProps = ({ location, datasets }) => ({
  layerGroups: getLayerGroups({ ...location, datasets: datasets.data }),
  activeTab: location.payload.zoom,
  legendLoading: datasets.loading
});

export default connect(mapStateToProps, null)(Component);
