import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-tree-gain-actions';
import reducers, { initialState } from './widget-tree-gain-reducers';
import { getFilteredData, getSentence } from './widget-tree-gain-selectors';
import WidgetTreeGainComponent from './widget-tree-gain-component';

const mapStateToProps = (
  { location, widgetTreeGain, countryData },
  ownProps
) => {
  const { locationNames, activeIndicator } = ownProps;
  const { data: { gain }, settings } = widgetTreeGain;
  let meta = countryData.countries;
  if (location.payload.subRegion) {
    meta = countryData.subRegions;
  } else if (location.payload.region) {
    meta = countryData.regions;
  }

  const selectorData = {
    data: gain,
    settings,
    location: location.payload,
    meta,
    colors: COLORS.gain,
    indicator: activeIndicator,
    locationNames
  };

  return {
    data: getFilteredData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeGainContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getTreeGain } = this.props;
    getTreeGain({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeGain } = nextProps;
    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear)
    ) {
      getTreeGain({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetTreeGainComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeGainContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeGain: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeGainContainer);
