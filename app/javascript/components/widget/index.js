import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { track } from 'app/analytics';

import WidgetComponent from './component';

class WidgetContainer extends Component {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    setWidgetData: PropTypes.func.isRequired,
    refetchKeys: PropTypes.array,
    settings: PropTypes.object,
    handleChangeSettings: PropTypes.func
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
    const { location, settings } = this.props;
    const params = { ...location, ...settings };

    this.handleGetWidgetData(params);
  }

  componentDidUpdate(prevProps, prevState) {
    const { location, settings, refetchKeys } = this.props;
    const { error } = this.state;

    const hasLocationChanged =
      location && !isEqual(location, prevProps.location);
    const hasErrorChanged =
      !error &&
      prevState.error !== undefined &&
      !isEqual(error, prevState.error);
    const refetchSettings = pick(settings, refetchKeys);
    const refetchPrevSettings = pick(prevProps.settings, refetchKeys);
    const hasSettingsChanged = !isEqual(refetchSettings, refetchPrevSettings);

    // refetch data if error, settings, or location changes
    if (hasSettingsChanged || hasLocationChanged || hasErrorChanged) {
      const params = { ...location, ...settings };
      this.handleGetWidgetData(params);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleGetWidgetData = params => {
    const { getData, setWidgetData } = this.props;
    this.cancelWidgetDataFetch();
    this.widgetDataFetch = CancelToken.source();

    this.setState({ loading: true, error: false });
    getData({ ...params, token: this.widgetDataFetch.token })
      .then(data => {
        setWidgetData(data);
        setTimeout(() => {
          if (this._mounted) {
            this.setState({ loading: false, error: false });
          }
        }, 200);
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

  handleDataHighlight = highlighted => {
    this.props.handleChangeSettings({ highlighted });
  };

  cancelWidgetDataFetch = () => {
    if (this.widgetDataFetch) {
      this.widgetDataFetch.cancel(`Cancelling ${this.props.widget} fetch`);
    }
  };

  render() {
    return createElement(WidgetComponent, {
      ...this.props,
      ...this.state,
      handleRefetchData: this.handleRefetchData,
      handleDataHighlight: this.handleDataHighlight
    });
  }
}

export default WidgetContainer;
