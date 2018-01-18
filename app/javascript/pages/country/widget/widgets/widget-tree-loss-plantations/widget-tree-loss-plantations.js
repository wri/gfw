import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-tree-loss-plantations-actions';
import reducers, {
  initialState
} from './widget-tree-loss-plantations-reducers';
import {
  filterData,
  getSentence
} from './widget-tree-loss-plantations-selectors';
import WidgetTreeLossPlantationsComponent from './widget-tree-loss-plantations-component';

const mapStateToProps = ({ widgetTreeLossPlantations }, ownProps) => {
  const { locationNames, activeIndicator } = ownProps;
  const { data, settings } = widgetTreeLossPlantations;
  const selectorData = {
    loss: data.loss,
    totalLoss: data.totalLoss,
    extent: data.extent,
    settings,
    locationNames,
    activeIndicator
  };
  return {
    data: filterData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeLossPlantationsContainer extends PureComponent {
  componentWillMount() {
    const { getTreeLossPlantations, location, settings } = this.props;
    getTreeLossPlantations({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getTreeLossPlantations, location, settings } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLossPlantations({ ...location, ...settings });
    }
  }

  render() {
    return createElement(WidgetTreeLossPlantationsComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLossPlantationsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLossPlantations: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetTreeLossPlantationsContainer
);
