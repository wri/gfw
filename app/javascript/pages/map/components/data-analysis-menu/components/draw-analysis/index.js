import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MAP, DASHBOARDS } from 'router';

import * as modalMetaActions from 'components/modals/meta/meta-actions';
import * as modalShareActions from 'components/modals/share/share-actions';
import * as dataAnalysisActions from 'pages/map/components/data-analysis-menu/actions';

import { getDrawAnalysisProps } from './selectors';
import Component from './component';

const actions = {
  ...modalMetaActions,
  ...modalShareActions,
  ...dataAnalysisActions
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearAnalysis: query => ({
        type: MAP,
        query
      }),
      goToDashboard: (location, query) => ({
        type: DASHBOARDS,
        payload: location,
        query
      }),
      ...actions
    },
    dispatch
  );

class PolygonAnalysisContainer extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(getDrawAnalysisProps, mapDispatchToProps)(
  PolygonAnalysisContainer
);
