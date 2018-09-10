import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from 'pages/map-v2/components/data-analysis-menu/actions';
import { filterWidgetByAnalysis } from 'components/widgets/selectors';

import Component from './location-analysis-component';

const mapStateToProps = ({ dataAnalysis }) => ({
  location: dataAnalysis.analysis.location,
  widgets: filterWidgetByAnalysis()
});

class LocationAnalysisContainer extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(LocationAnalysisContainer);
