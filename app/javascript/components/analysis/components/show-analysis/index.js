import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as modalMetaActions from 'components/modals/meta/actions';
import * as modalShareActions from 'components/modals/share/share-actions';
import * as modalSourcesActions from 'components/modals/sources/actions';
import { setMenuSettings } from 'components/map-menu/actions';
import * as dataAnalysisActions from 'components/analysis/actions';

import { getShowAnalysisProps } from './selectors';
import Component from './component';

const actions = {
  ...modalMetaActions,
  ...modalShareActions,
  ...modalSourcesActions,
  ...dataAnalysisActions,
  setMenuSettings
};

class ShowAnalysisContainer extends PureComponent {
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

export default connect(getShowAnalysisProps, actions)(ShowAnalysisContainer);
