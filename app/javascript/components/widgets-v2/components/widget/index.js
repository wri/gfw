import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import * as actions from 'components/widgets-v2/actions';
import Component from './component';

class WidgetContainer extends PureComponent {
  componentDidMount() {
    const {
      getData,
      getWidgetData,
      widget,
      location,
      settings,
      data
    } = this.props;
    const params = { ...location, ...settings };
    if (!data) {
      getWidgetData({ widget, getData, params });
    }
  }

  componentDidUpdate(prevProps) {
    const { location, settings, getData, getWidgetData, widget } = this.props;
    const hasSettingsChanged =
      settings &&
      prevProps.settings &&
      (!isEqual(settings, prevProps.settings) ||
        !isEqual(location, prevProps.location));
    const params = { ...location, ...settings };
    if (hasSettingsChanged) getWidgetData({ widget, getData, params });
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
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  getData: PropTypes.func,
  getWidgetData: PropTypes.func,
  widget: PropTypes.string
};

export default connect(null, actions)(WidgetContainer);
