import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as modalMetaActions from 'components/modals/meta/meta-actions';
import * as modalShareActions from 'components/modals/share/share-actions';
import * as modalSourcesActions from 'components/modals/sources/actions';
import * as dataAnalysisActions from 'components/map-v2/components/data-analysis-menu/actions';

import { getDrawAnalysisProps } from './selectors';
import Component from './component';

const actions = {
  ...modalMetaActions,
  ...modalShareActions,
  ...modalSourcesActions,
  ...dataAnalysisActions
};

class PolygonAnalysisContainer extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(getDrawAnalysisProps, actions)(PolygonAnalysisContainer);
