import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from 'pages/map/data-analysis-menu/actions';
import Component from './chose-analysis-component';

const mapStateToProps = ({ countryData, dataAnalysis }) => ({
  countries: countryData.countries,
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
