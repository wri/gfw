import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from 'pages/map/components/data-analysis-menu/actions';
import Component from './chose-analysis-component';

const mapStateToProps = ({ countryData, dataAnalysis }) => ({
  countryData,
  location: dataAnalysis.analysis.location
});

class ChoseAnalysisContainer extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(ChoseAnalysisContainer);
