import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

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
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(DataAnalysisMenuContainer);
