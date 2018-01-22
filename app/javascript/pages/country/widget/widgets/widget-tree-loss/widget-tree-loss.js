import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-tree-loss-actions';
import reducers, { initialState } from './widget-tree-loss-reducers';
import {
  chartData,
  chartConfig,
  getSentence
} from './widget-tree-loss-selectors';
import WidgetTreeLossComponent from './widget-tree-loss-component';

const mapStateToProps = ({ widgetTreeLoss }, ownProps) => {
  const { locationNames, activeIndicator } = ownProps;
  const { data, settings } = widgetTreeLoss;
  const selectorData = {
    loss: data.loss,
    extent: data.extent,
    settings,
    locationNames,
    activeIndicator,
    colors: COLORS.loss
  };
  return {
    data: chartData(selectorData),
    config: chartConfig(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeLossContainer extends PureComponent {
  componentWillMount() {
    const { getTreeLoss, location, settings } = this.props;
    getTreeLoss({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getTreeLoss, location, settings } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLoss({ ...location, ...settings });
    }
  }

  render() {
    return createElement(WidgetTreeLossComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLossContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLoss: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
