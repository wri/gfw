import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-ranked-plantations-actions';
import reducers, { initialState } from './widget-ranked-plantations-reducers';
import {
  chartData,
  chartConfig,
  getSentence
} from './widget-ranked-plantations-selectors';
import WidgetRankedPlantationsComponent from './widget-ranked-plantations-component';

const mapStateToProps = (
  { location, widgetRankedPlantations, countryData },
  ownProps
) => {
  const { data, settings } = widgetRankedPlantations;
  const { locationNames } = ownProps;
  const { payload } = location;
  const selectorData = {
    extent: data.extent,
    plantations: data.plantations,
    meta: countryData[!payload.region ? 'regions' : 'subRegions'],
    settings,
    location: payload,
    locationNames,
    colors: COLORS.plantations
  };
  return {
    data: chartData(selectorData),
    config: chartConfig(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetRankedPlantationsContainer extends PureComponent {
  componentWillMount() {
    const { getRankedPlantations, location, settings } = this.props;
    getRankedPlantations({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getRankedPlantations, location, settings } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getRankedPlantations({ ...location, ...settings });
    }
  }

  render() {
    return createElement(WidgetRankedPlantationsComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetRankedPlantationsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getRankedPlantations: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetRankedPlantationsContainer
);
