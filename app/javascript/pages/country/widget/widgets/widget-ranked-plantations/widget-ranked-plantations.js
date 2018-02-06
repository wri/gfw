import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

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
  const { colors, locationNames } = ownProps;
  const { payload } = location;
  const selectorData = {
    extent: data.extent,
    plantations: data.plantations,
    meta: countryData[!payload.region ? 'regions' : 'subRegions'],
    settings,
    location,
    locationNames,
    colors
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
    const { type, extentYear, threshold } = settings;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(type, this.props.settings.type) ||
      !isEqual(extentYear, this.props.settings.extentYear) ||
      !isEqual(threshold, this.props.settings.threshold)
    ) {
      getRankedPlantations({ ...location, ...settings });
    }
  }

  handlePageChange = change => {
    const { setRankedPlantationsPage, settings } = this.props;
    setRankedPlantationsPage(settings.page + change);
  };

  render() {
    return createElement(WidgetRankedPlantationsComponent, {
      ...this.props,
      getSentence: this.getSentence,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetRankedPlantationsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getRankedPlantations: PropTypes.func.isRequired,
  setRankedPlantationsPage: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetRankedPlantationsContainer
);
