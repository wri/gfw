import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-economic-impact-actions';
import reducers, { initialState } from './widget-economic-impact-reducers';
import {
  chartData,
  chartConfig,
  rankData,
  getSentence
} from './widget-economic-impact-selectors';
import WidgetEconomicImpactComponent from './widget-economic-impact-component';

const mapStateToProps = ({ widgetEconomicImpact, countryData }, ownProps) => {
  const { data, settings } = widgetEconomicImpact;
  const { colors, locationNames } = ownProps;
  const selectorData = {
    data,
    meta: countryData.countries,
    settings,
    locationNames,
    colors: colors.extent
  };

  return {
    chartData: chartData(selectorData),
    chartConfig: chartConfig(selectorData),
    rankData: rankData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetEconomicImpactContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getEconomicImpact } = this.props;
    getEconomicImpact({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getEconomicImpact, location } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getEconomicImpact({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetEconomicImpactComponent, {
      ...this.props
    });
  }
}

WidgetEconomicImpactContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getEconomicImpact: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetEconomicImpactContainer);
