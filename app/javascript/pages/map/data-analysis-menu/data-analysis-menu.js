import { connect } from 'react-redux';

import { filterWidgetByAnalysis } from 'components/widgets/selectors';
import { getActiveLayers } from './selectors';

import Component from './component';

const mapStateToProps = ({ location, datasets }) => ({
  layerGroups: getActiveLayers({ datasets: datasets.data }),
  activeTab: location.payload.zoom,
  legendLoading: datasets.loading,
  widgets: filterWidgetByAnalysis()
});

export default connect(mapStateToProps, null)(Component);
