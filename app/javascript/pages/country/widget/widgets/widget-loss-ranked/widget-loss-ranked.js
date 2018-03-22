import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-loss-ranked-actions';
import reducers, { initialState } from './widget-loss-ranked-reducers';
import { getFilteredData, getSentence } from './widget-loss-ranked-selectors';
import WidgetTreeLossRankedComponent from './widget-loss-ranked-component';

const mapStateToProps = (
  { location, widgetLossRanked, countryData },
  ownProps
) => {
  const { colors, locationNames, activeIndicator } = ownProps;
  const { data: { loss }, settings } = widgetLossRanked;
  let meta = countryData.countries;
  if (location.payload.subRegion) {
    meta = countryData.subRegions;
  } else if (location.payload.region) {
    meta = countryData.regions;
  }

  const selectorData = {
    data: loss,
    settings,
    location: location.payload,
    meta,
    colors,
    indicator: activeIndicator,
    locationNames
  };

  return {
    data: getFilteredData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeLossRankedContainer extends PureComponent {
  componentWillMount() {
    const { settings, getLossRanked } = this.props;
    getLossRanked({
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getLossRanked } = nextProps;
    if (
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.startYear, this.props.settings.startYear) ||
      !isEqual(settings.endYear, this.props.settings.endYear)
    ) {
      getLossRanked({
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetTreeLossRankedComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLossRankedContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  getLossRanked: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeLossRankedContainer);
