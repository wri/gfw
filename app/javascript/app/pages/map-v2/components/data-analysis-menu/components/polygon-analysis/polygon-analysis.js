import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import modalMetaActions from 'components/modals/meta/meta-actions';
import dataAnalysisActions from 'pages/map-v2/components/data-analysis-menu/actions';

import Component from './polygon-analysis-component';

const actions = {
  ...modalMetaActions,
  ...dataAnalysisActions
};

const mapStateToProps = ({ dataAnalysis }) => ({
  analysis: dataAnalysis.analysis
});

class PolygonAnalysisContainer extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(PolygonAnalysisContainer);
