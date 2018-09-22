import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import * as actions from 'components/widgets-v2/actions';
// import { getWidgetProps } from './selectors';
import Component from './component';

class WidgetContainer extends PureComponent {
  componentDidMount() {
    const { getData, getWidgetData, widget, location, settings } = this.props;
    const params = { ...location, ...settings };
    getWidgetData({ widget, getData, params });
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      settings,
      getData,
      getWidgetData,
      widget,
      params
    } = this.props;
    const hasSettingsChanged =
      settings &&
      prevProps.settings &&
      (!isEqual(settings, this.props.settings) ||
        !isEqual(location, this.props.location));

    // if (hasSettingsChanged) getWidgetData({ widget, getData, params });
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

WidgetContainer.propTypes = {
  settings: PropTypes.object,
  location: PropTypes.object,
  getData: PropTypes.func,
  getWidgetData: PropTypes.func,
  widget: PropTypes.string
};

export default connect(null, actions)(WidgetContainer);
