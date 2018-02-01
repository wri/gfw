import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-fires-actions';
import reducers, { initialState } from './widget-fires-reducers';
import {
  getSortedData,
  chartConfig,
  getSentence
} from './widget-fires-selectors';
import WidgetFiresComponent from './widget-fires-component';

const mapStateToProps = ({ widgetFires }, ownProps) => {
  const { data } = widgetFires;
  const { locationNames } = ownProps;
  const selectorData = {
    data,
    locationNames,
    colors: COLORS.fires
  };

  return {
    chartData: getSortedData(selectorData),
    chartConfig: chartConfig(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetFiresContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getFiresData } = this.props;
    getFiresData({ ...location, ...settings });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getFiresData } = nextProps;
    if (!isEqual(location.country, this.props.location.country)) {
      getFiresData({ ...location, ...settings });
    }
  }

  render() {
    return createElement(WidgetFiresComponent, {
      ...this.props
    });
  }
}

WidgetFiresContainer.propTypes = {
  location: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getFiresData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetFiresContainer);
