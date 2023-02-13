import { Component } from 'react';
import PropTypes from 'prop-types';
import { InView } from 'react-intersection-observer';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import pick from 'lodash/pick';
import has from 'lodash/has';
import { trackEvent } from 'utils/analytics';

import WidgetComponent from './component';

class WidgetContainer extends Component {
  static propTypes = {
    widget: PropTypes.string,
    location: PropTypes.object,
    getData: PropTypes.func,
    setWidgetData: PropTypes.func,
    chartSettings: PropTypes.object,
    getChartSettings: PropTypes.func,
    setWidgetChartSettings: PropTypes.func,
    refetchKeys: PropTypes.array,
    settings: PropTypes.object,
    handleChangeSettings: PropTypes.func,
    geostore: PropTypes.object,
    meta: PropTypes.object,
    status: PropTypes.string,
    maxDownloadSize: PropTypes.object,
    dashboard: PropTypes.bool,
    embed: PropTypes.bool,
    analysis: PropTypes.bool,
  };

  static defaultProps = {
    widget: '',
    location: {},
    getData: fetch,
    setWidgetData: () => {},
    getChartSettings: () => {},
    setWidgetChartSettings: () => {},
  };

  state = {
    loading: true,
    error: false,
    maxSize: null,
    downloadDisabled: false,
    filterSelected: false,
  };

  _mounted = false;

  componentDidMount() {
    this._mounted = true;
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
      this.handleGetWidgetChartSettings();
      this.handleGetWidgetData();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleMaxRowSize(data) {
    const { maxDownloadSize = null, settings } = this.props;
    if (!maxDownloadSize) return { downloadDisabled: false };
    const { key, subKey = null, entryKey, maxSize } = maxDownloadSize;

    const filterSelected = !!settings?.forestType || !!settings?.landCategory;

    const dataEntry = data[key];
    let dataKey = key;
    if (subKey) {
      dataKey = subKey;
    }

    if (
      has(dataEntry, dataKey) &&
      Array.isArray(dataEntry[dataKey]) &&
      maxSize
    ) {
      const exceedsMaxSize = entryKey
        ? sumBy(dataEntry[dataKey], entryKey) > maxSize
        : sumBy(dataEntry, dataKey) > maxSize;
      return {
        downloadDisabled: filterSelected || exceedsMaxSize,
        maxSize,
        filterSelected,
      };
    }
    return { downloadDisabled: false, maxSize };
  }

  handleGetWidgetData = () => {
    const { location, settings } = this.props;
    const params = { ...location, ...settings };

    if (!params?.type) return;

    const {
      getData,
      setWidgetData,
      geostore,
      dashboard,
      embed,
      analysis,
    } = this.props;
    this.cancelWidgetDataFetch();
    this.widgetDataFetch = CancelToken.source();
    this.setState({ loading: true, error: false });
    getData({
      ...params,
      geostore,
      token: this.widgetDataFetch.token,
      dashboard,
      embed,
      analysis,
    })
      .then((data) => {
        setWidgetData(data);
        setTimeout(() => {
          if (this._mounted) {
            this.setState({
              ...this.handleMaxRowSize(data),
              loading: false,
              error: false,
            });
          }
        }, 200);
      })
      .catch((error) => {
        if (this._mounted) {
          this.setState({
            error: error.message !== `Cancelling ${this.props.widget} fetch`,
            loading: false,
          });
        }
      });
  };

  handleGetWidgetChartSettings = () => {
    const {
      getChartSettings,
      setWidgetChartSettings,
      dashboard,
      embed,
    } = this.props;
    setWidgetChartSettings(getChartSettings({ dashboard, embed }));
  };

  handleRefetchData = () => {
    this.handleGetWidgetData();
    this.handleGetWidgetChartSettings();
    trackEvent({
      category: 'Refetch data',
      action: 'Data failed to fetch, user clicks to refetch',
      label: `Widget: ${this.props.widget}`,
    });
  };

  handleDataHighlight = (highlighted) => {
    this.props.handleChangeSettings({ highlighted });
  };

  cancelWidgetDataFetch = () => {
    if (this.widgetDataFetch) {
      this.widgetDataFetch.cancel(`Cancelling ${this.props.widget} fetch`);
    }
  };

  render() {
    const widgetProps = {
      ...this.props,
      ...this.state,
      handleRefetchData: this.handleRefetchData,
      handleDataHighlight: this.handleDataHighlight,
    };

    return (
      <InView
        triggerOnce
        onChange={(inView) => {
          if (!inView) return;
          this.handleGetWidgetChartSettings();
          this.handleGetWidgetData();
        }}
      >
        {({ ref }) => <WidgetComponent ref={ref} {...widgetProps} />}
      </InView>
    );
  }
}

export default WidgetContainer;
