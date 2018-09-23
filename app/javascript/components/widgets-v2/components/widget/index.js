import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import * as actions from 'components/widgets-v2/actions';
import Component from './component';
import { getWidgetProps } from './selectors';

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
    const settingsUpdateBlackList = [
      'startYear',
      'endYear',
      'activeData',
      'weeks',
      'page'
    ];
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
      !settingsUpdateBlackList.includes(changedSetting);
    const params = { ...location, ...settings };
    if (hasSettingsChanged) getWidgetData({ widget, getData, params });
  }

  componentWillUnmount() {
    this.props.removeWidget(this.props.widget);
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
  widget: PropTypes.string,
  removeWidget: PropTypes.func
};

export default connect(getWidgetProps, actions)(WidgetContainer);
