import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import { setMapSettings as setMapState } from 'components/map/actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import { setShareModal } from 'components/modals/share/share-actions';

import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';
import { getWidgetsProps } from './selectors';

const actions = {
  ...ownActions,
  setMapSettings: setMapState,
  setModalMetaSettings,
  setShareModal
};

class WidgetsContainer extends PureComponent {
  static propTypes = {
    getWidgetsData: PropTypes.func,
    location: PropTypes.object
  };

  componentDidMount() {
    const { getWidgetsData, location } = this.props;
    if (location.type === 'global') {
      getWidgetsData();
    }
  }

  componentDidUpdate(prevProps) {
    const { getWidgetsData } = this.props;

    if (location.type === 'global' && prevProps.location.type !== 'global') {
      getWidgetsData();
    }
  }

  render() {
    return createElement(Component, {
      ...this.props,
      handleShowMap: this.handleShowMap
    });
  }
}

reducerRegistry.registerModule('widgets', {
  actions,
  reducers,
  initialState
});

export default connect(getWidgetsProps, actions)(WidgetsContainer);
