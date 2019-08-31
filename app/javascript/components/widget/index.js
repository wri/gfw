import { createElement, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';

import WidgetComponent from './component';

const mapStateToProps = (state, props) => {
  const { parseData } = props;
  const parsedProps = {
    ...props,
    ...parseData(props)
  };
  const { data, title, settings, location } = parsedProps;

  return {
    ...parsedProps,
    options: props.options.map(o => {
      const options = typeof o.options === 'function' ? o.options({ settings, data }) : o.options;
      return {
        ...o,
        options,
        value: options.find(opt => opt.value === props.settings[o.key])
      };
    }),
    title: title && title.replace('{location}', location.label || '...')
  };
};

class WidgetContainer extends Component {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    refetchKeys: PropTypes.array,
    location: PropTypes.object.isRequired,
    error: PropTypes.bool,
    settings: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    getData: PropTypes.func.isRequired,
    setWidgetData: PropTypes.func.isRequired
  };

  state = {
    loading: false,
    error: false
  }

  componentDidMount() {
    const {
      location,
      settings,
      data
    } = this.props;
    const params = { ...location, ...settings };

    if (!data || data.noContent) {
      this.handleGetWidgetData(params);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      location,
      settings,
      refetchKeys
    } = this.props;
    const { error } = this.state;

    const hasLocationChanged = !isEqual(location, prevProps.location);
    const hasErrorChanged =
      !error &&
      prevState.error !== undefined &&
      !isEqual(error, prevState.error);
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
      this.handleGetWidgetData(params);
    }
  }

  handleGetWidgetData = params => {
    const { getData, setWidgetData } = this.props;

    this.cancelWidgetDataFetch();
    this.widgetDataFetch = CancelToken.source();

    this.setState({ loading: true, error: false });
    getData({ ...params, token: this.widgetDataFetch.token })
      .then(data => {
        setWidgetData(data);
        this.setState({ loading: false, error: false });
      })
      .catch(error => {
        this.setState({ error: true, loading: false });
        console.info(error);
      });
  };

  cancelWidgetDataFetch = () => {
    if (this.widgetDataFetch) {
      this.widgetDataFetch.cancel(`Cancelling ${this.props.widget} fetch`);
    }
  };

  render() {
    return createElement(WidgetComponent, {
      ...this.props,
      ...this.state
    });
  }
}

export default connect(mapStateToProps)(WidgetContainer);
