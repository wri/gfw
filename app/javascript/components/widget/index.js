import { createElement, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import compact from 'lodash/compact';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';

import { setMapSettings as setMapState } from 'components/map/actions';
import * as ownActions from 'components/widgets/actions';
import WidgetComponent from './component';
import { getWidgetProps } from './selectors';
import { getWidgetDatasets, getPolynameDatasets } from './utils/layers';

const actions = {
  ...ownActions,
  setMapSettings: setMapState
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
  const getWidgetPropsObject = getWidgetProps();
  const mapStateToProps = (state, props) => ({
    ...getWidgetPropsObject(state, props)
  });
  return mapStateToProps;
};

class WidgetContainer extends Component {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    active: PropTypes.bool,
    error: PropTypes.bool,
    settings: PropTypes.object,
    polynames: PropTypes.array,
    options: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    getData: PropTypes.func.isRequired,
    handleSyncMap: PropTypes.func.isRequired
  };

  componentDidMount() {
    const {
      widget,
      location,
      settings,
      data,
      active,
      config
    } = this.props;
    const params = { ...location, ...settings };

    if (!data || data.noContent) {
      this.handleGetWidgetData({ widget, params });
    }

    if (active && config && config.datasets) {
      this.syncWidgetWithMap();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      active,
      location,
      settings,
      config,
      widget,
      error
    } = this.props;
    const { refetchKeys } = config || {};

    const hasLocationChanged = !isEqual(location, prevProps.location);
    const hasErrorChanged =
      !error &&
      prevProps.error !== undefined &&
      !isEqual(error, prevProps.error);
    let changedSetting = '';
    if (settings && prevProps.settings) {
      Object.keys(settings).forEach(s => {
        if (!isEqual(settings[s], prevProps.settings[s])) {
          changedSetting = s;
        }
      });
    }
    const hasSettingsChanged =
      settings &&
      prevProps.settings &&
      changedSetting &&
      !refetchKeys.includes(changedSetting);

    // refetch data if error, settings, or location changes
    if (hasSettingsChanged || hasLocationChanged || hasErrorChanged) {
      const params = { ...location, ...settings };
      this.handleGetWidgetData({ widget, params });
    }

    // if widget is active and layers or params change push to map
    if (active) {
      const { datasets } = config || {};
      const mapSettingsChanged =
        settings &&
        intersection(mapSyncKeys, Object.keys(settings)).length &&
        !isEqual(settings, prevProps.settings);
      const activeChanged = !isEqual(active && prevProps.active);
      if (datasets && (mapSettingsChanged || activeChanged)) {
        this.syncWidgetWithMap();
      } else if (!datasets && activeChanged) {
        this.clearMap();
      }
    }

    // if widget is no longer active remove layers from map
    if (!active && !isEqual(active, prevProps.active)) {
      this.clearMap();
    }
  }

  componentWillUnmount = () => {
    const { handleSetWigetData } = this.props;
    handleSetWigetData();
  };

  syncWidgetWithMap = () => {
    const { handleSyncMap, settings, config, polynames, options } = this.props;
    const { datasets } = config || {};

    const widgetDatasets =
      datasets &&
      datasets.length &&
      getWidgetDatasets({ datasets, ...settings });

    const polynameDatasets =
      polynames &&
      polynames.length &&
      getPolynameDatasets({ polynames, options, settings });

    const allDatasets = [...compact(polynameDatasets), ...widgetDatasets];

    handleSyncMap({
      datasets: allDatasets
    });
  };

  clearMap = () => {
    const { handleSyncMap } = this.props;
    handleSyncMap({
      datasets: [adminBoundaryLayer]
    });
  };

  handleGetWidgetData = params => {
    const { getData } = this.props;

    this.cancelWidgetDataFetch();
    this.widgetDataFetch = CancelToken.source();
    getData({ ...params, token: this.widgetDataFetch.token });
    this.cancelWidgetDataFetch();
  };

  cancelWidgetDataFetch = () => {
    if (this.widgetDataFetch) {
      this.widgetDataFetch.cancel(`Cancelling ${this.props.widget} fetch`);
    }
  };

  render() {
    return createElement(WidgetComponent, {
      ...this.props
    });
  }
}

export default connect(makeMapStateToProps, actions)(WidgetContainer);
