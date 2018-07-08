import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { filterWidgetByAnalysis } from 'components/widgets/selectors';
import { getActiveLayers } from './selectors';
import actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';

const mapStateToProps = ({ location, datasets, dataAnalysis }) => ({
  layerGroups: getActiveLayers({ datasets: datasets.data }),
  activeTab: location.payload.tab,
  legendLoading: datasets.loading,
  widgets: filterWidgetByAnalysis(),
  analysis: dataAnalysis.analysis
});

class DataAnalysisMenuContainer extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { analysis, getGeostore, getAnalysis } = nextProps;
    if (!isEqual(analysis.polygon, this.props.analysis.polygon)) {
      getGeostore(analysis.polygon);
    }
    if (!isEqual(analysis.geostore, this.props.analysis.geostore)) {
      getAnalysis(analysis.geostore);
    }
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}
DataAnalysisMenuContainer.propTypes = {
  analysis: PropTypes.object,
  getGeostore: PropTypes.func,
  getAnalysis: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(DataAnalysisMenuContainer);
