import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as modalMetaActions from 'components/modals/meta/meta-actions';
import * as modalShareActions from 'components/modals/share/share-actions';
import * as modalSourcesActions from 'components/modals/sources/actions';
import * as dataAnalysisActions from 'components/map-v2/components/analysis/actions';

import { getDrawAnalysisProps } from './selectors';
import Component from './component';

const actions = {
  ...modalMetaActions,
  ...modalShareActions,
  ...modalSourcesActions,
  ...dataAnalysisActions
};

class PolygonAnalysisContainer extends PureComponent {
  state = {
    showDownloads: false
  };

  handleShowDownloads = show => {
    this.setState({ showDownloads: show });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      ...this.state,
      handleShowDownloads: this.handleShowDownloads
    });
  }
}

export default connect(getDrawAnalysisProps, actions)(PolygonAnalysisContainer);
