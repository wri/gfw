import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import compact from 'lodash/compact';

import reducerRegistry from 'app/registry';

import { setMapSettings as setMapState } from 'components/map/actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import { setShareModal } from 'components/modals/share/share-actions';

import { getWidgetDatasets, getPolynameDatasets } from './utils/config';
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

const mapSyncKeys = [
  'startYear',
  'endYear',
  'threshold',
  'extentYear',
  'forestType',
  'landCategory'
];

const adminBoundaryLayer = {
  dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
  layers: [
    '6f6798e6-39ec-4163-979e-182a74ca65ee',
    'c5d1e010-383a-4713-9aaa-44f728c0571c'
  ],
  opacity: 1,
  visibility: true
};

const makeMapStateToProps = () => {
  const getWidgetPropsObject = getWidgetsProps();
  const mapStateToProps = (state, props) => ({
    ...getWidgetPropsObject(state, props)
  });
  return mapStateToProps;
};

class WidgetsContainer extends PureComponent {
  static propTypes = {
    getWidgetsData: PropTypes.func,
    location: PropTypes.object,
    activeWidget: PropTypes.object,
    setMapSettings: PropTypes.func,
    embed: PropTypes.bool
  };

  state = {
    loading: true
  };

  componentDidMount() {
    const { getWidgetsData, location, activeWidget, embed } = this.props;
    if (location.type === 'global') {
      getWidgetsData();
    }

    if (!embed && activeWidget && activeWidget.datasets) {
      this.syncWidgetWithMap();
    }

    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  }

  componentDidUpdate(prevProps) {
    const { getWidgetsData, activeWidget, embed } = this.props;

    if (location.type === 'global' && prevProps.location.type !== 'global') {
      getWidgetsData();
    }

    // if widget is active and layers or params change push to map
    if (!embed && activeWidget) {
      const { settings, datasets } = activeWidget || {};
      const mapSettingsChanged =
        settings &&
        intersection(mapSyncKeys, Object.keys(settings)).length &&
        !isEqual(settings, prevProps.settings);
      const activeWidgetChanged = !isEqual(
        activeWidget,
        prevProps.activeWidget
      );
      if (datasets && (mapSettingsChanged || activeWidgetChanged)) {
        this.syncWidgetWithMap();
      } else if (!datasets && activeWidgetChanged) {
        this.clearMap();
      }
    }

    // if widget is no longer activeWidget remove layers from map
    if (
      !embed &&
      !activeWidget &&
      !isEqual(activeWidget, prevProps.activeWidget)
    ) {
      this.clearMap();
    }
  }

  syncWidgetWithMap = () => {
    const { activeWidget, setMapSettings } = this.props;
    const { datasets, settings, optionsSelected } = activeWidget || {};
    const widgetDatasets =
      datasets &&
      datasets.length &&
      getWidgetDatasets({ datasets, ...settings });

    const polynameDatasets = getPolynameDatasets({ optionsSelected, settings });
    const allDatasets = [...compact(polynameDatasets), ...widgetDatasets];

    setMapSettings({
      datasets: allDatasets
    });
  };

  clearMap = () => {
    const { setMapSettings } = this.props;
    setMapSettings({
      datasets: [adminBoundaryLayer]
    });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      ...this.state
    });
  }
}

reducerRegistry.registerModule('widgets', {
  actions,
  reducers,
  initialState
});

export default connect(makeMapStateToProps, actions)(WidgetsContainer);
