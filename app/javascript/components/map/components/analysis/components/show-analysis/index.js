import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as modalMetaActions from 'components/modals/meta/meta-actions';
import * as modalShareActions from 'components/modals/share/share-actions';
import * as modalSourcesActions from 'components/modals/sources/actions';
import { setMenuSettings } from 'pages/map/components/menu/menu-actions';
import * as dataAnalysisActions from 'components/map/components/analysis/actions';

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
