import { createElement, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import compact from 'lodash/compact';
import intersection from 'lodash/intersection';
import { track } from 'app/analytics';

import WidgetComponent from './component';
import { getWidgetProps } from './selectors';
import { getWidgetDatasets, getPolynameDatasets } from './utils';

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
  const mapStateToProps = (state, props) => {
    const { parsedProps, ...rest } = getWidgetPropsObject(props);
    return {
      ...parsedProps,
      ...rest
    };
  };
  return mapStateToProps;
};

class WidgetContainer extends Component {
  static propTypes = {
    active: PropTypes.bool,
    widget: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    setWidgetData: PropTypes.func.isRequired,
    refetchKeys: PropTypes.array,
    error: PropTypes.bool,
    settings: PropTypes.object,
    datasets: PropTypes.array,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    handleSyncMap: PropTypes.func,
    polynames: PropTypes.array,
    optionsSelected: PropTypes.array
  };

  static defaultProps = {
    widget: '',
    location: {},
    getData: fetch,
    setWidgetData: () => {}
  };

  state = {
    loading: false,
    error: false
  };

  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    const { location, settings, data } = this.props;
    const params = { ...location, ...settings };

    if (!data || data.noContent) {
      this.handleGetWidgetData(params);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { location, settings, refetchKeys, datasets, active } = this.props;
    const { error } = this.state;

    const hasLocationChanged = !isEqual(location, prevProps.location);
    const hasErrorChanged =
      !error &&
      prevState.error !== undefined &&
      !isEqual(error, prevState.error);
    const refetchSettings = refetchKeys
      ? pick(settings, refetchKeys)
      : settings;
    const refetchPrevSettings = refetchKeys
      ? pick(prevProps.settings, refetchKeys)
      : prevProps.settings;
    const hasSettingsChanged = !isEqual(refetchSettings, refetchPrevSettings);

    // refetch data if error, settings, or location changes
    if (hasSettingsChanged || hasLocationChanged || hasErrorChanged) {
      const params = { ...location, ...settings };
      this.handleGetWidgetData(params);
    }

    // if widget is active and layers or params change push to map
    if (active) {
      const mapSettingsChanged =
        settings &&
        intersection(mapSyncKeys, Object.keys(settings)).length &&
        !isEqual(settings, prevProps.settings);
      const activeChanged = !isEqual(active, prevProps.active);
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

  componentWillUnmount() {
    this._mounted = false;
    this.cancelWidgetDataFetch();
  }

  handleGetWidgetData = params => {
    const { getData, setWidgetData } = this.props;
    this.cancelWidgetDataFetch();
    this.widgetDataFetch = CancelToken.source();

    this.setState({ loading: true, error: false });
    getData({ ...params, token: this.widgetDataFetch.token })
      .then(data => {
        setWidgetData(data);
        if (this._mounted) {
          this.setState({ loading: false, error: false });
        }
      })
      .catch(error => {
        console.info(error);
        if (this._mounted) {
          this.setState({
            error: error.message !== `Cancelling ${this.props.widget} fetch`,
            loading: false
          });
        }
      });
  };

  handleRefetchData = () => {
    const { settings, location, widget } = this.props;
    const params = { ...location, ...settings };
    this.handleGetWidgetData(params);
    track('refetchDataBtn', {
      label: `Widget: ${widget}`
    });
  };

  cancelWidgetDataFetch = () => {
    if (this.widgetDataFetch) {
      this.widgetDataFetch.cancel(`Cancelling ${this.props.widget} fetch`);
    }
  };

  syncWidgetWithMap = () => {
    const {
      handleSyncMap,
      datasets,
      settings,
      polynames,
      optionsSelected
    } = this.props;

    const widgetDatasets =
      datasets &&
      datasets.length &&
      getWidgetDatasets({ datasets, ...settings });

    const polynameDatasets =
      polynames &&
      polynames.length &&
      getPolynameDatasets({ polynames, optionsSelected, settings });

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

  render() {
    return createElement(WidgetComponent, {
      ...this.props,
      ...this.state,
      handleRefetchData: this.handleRefetchData
    });
  }
}

export default connect(makeMapStateToProps)(WidgetContainer);
